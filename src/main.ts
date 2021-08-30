import * as db from "./db"
import * as yeeyi from "./yeeyi"
import colors from 'colors';
import { log } from "console";

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getNowString(timestamp?: number): string {
    const date = timestamp ? new Date(timestamp) : new Date()
    const offset = date.getTimezoneOffset()
    const now = new Date(date.getTime() - (offset * 60 * 1000))
    return now.toISOString()
}

class Logger {

    public static log(message: string) {
        console.info(colors.yellow(getNowString()), colors.green("[INFO]"), message)
    }

    public static error(message: string) {
        console.error(colors.yellow(getNowString()), colors.green("[ERROR}"), colors.red(message))
    }
}

class Upper {

    private data?: db.LocalData

    public constructor() {

    }

    public init() {
        this.data = db.read()
    }

    public start() {
        if (this.data == null) {
            return
        }
        const check = () => {
            try {
                this.check()
            } catch (err) {
                if (err) {
                    Logger.error(`check with error ${err}`)
                }
            }
        }
        Logger.log("starting")
        Logger.log(`update interval ${this.data.checkInterval}s`)
        check()
        setInterval(() => {
            check()
        }, this.data.checkInterval * 1000)
    }

    private async check() {
        if (this.data == null) {
            return
        }
        const date = new Date()
        const hour = date.getHours()
        if (!(hour >= 8 && hour <= 19)) {
            return
        }

        const now = date.getTime()

        const posts = this.data.posts
        const postToUsed = posts.filter(post => {
            return post.timestamp == null || now >= post.timestamp
        })

        Logger.log(`checking posts, ${postToUsed.length} posts are ready to up`)

        await Promise.all(postToUsed.map(post => this.checkPost(post, now)))

        if (postToUsed.length > 0) {
            Logger.log("writing to file")
            try {
                db.write(this.data)
            } catch (err) {
                if (err) {
                    Logger.error(`failed to write ${err}`)
                }
            }
        }
    }

    private async checkPost(post: db.Post, now: number) {
        if (this.data == null) {
            return
        }
        if (!post.token) {
            Logger.log(`post ${post.tid} not exists`)
            try {
                post.token = await yeeyi.login(post.username, post.password)
                Logger.log(`post ${post.tid} got token ${post.token}`)
            } catch (err) {
                post.timestamp = now + 10 * 60 * 1000 // 10 分钟后尝试
                if (err) {
                    Logger.error(`post ${post.tid} failed to get token ${JSON.stringify(err)}`)
                }
                return
            }
        }
        try {
            const ret = await yeeyi.up(post.tid, post.token)
            console.log(ret)
            const date = new Date(now)
            const curHour = date.getHours()
            const diff = (this.data.end - curHour) * 60 * 1000
            if (ret.times == null) {
                date.setDate(date.getDate() + 1)
                date.setHours(this.data.start)
                post.timestamp = date.getTime()
                Logger.log(`post ${post.tid} 0 times left, next call ${getNowString(post.timestamp)}`)
                return
            }
            post.timestamp = now + diff / ret.times + (getRandomInt(-5, 5) * 60 * 1000) // 正负 5 分钟的偏差
            Logger.log(`post ${post.tid} ${ret.message}, next call ${getNowString(post.timestamp)}`)
        } catch (err) {
            post.token = ""
            post.timestamp = now + 10 * 60 * 1000 // 10 分钟后尝试
            Logger.error(`post ${post.tid} up failed ${JSON.stringify(err)}`)
        }
    }

}

const upper = new Upper()
upper.init()
upper.start()