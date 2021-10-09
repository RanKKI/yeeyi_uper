import * as db from "./db"
import * as yeeyi from "./yeeyi"
import colors from 'colors';

const nodemailer = require("nodemailer");

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

const mail = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "yeeyi.info@gmail.com",
        pass: "a1B@c3D$e5"
    }
})

enum Error {
    NULL_TOKEN = "Null Token"
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

    private onError(post: db.Post, err: string) {
        err = err || "未知错误"
        let content = `<h1>${err}</h1><p><b>Post:</b>${JSON.stringify(post, null, 2)} </p>`
        mail.sendMail({
            from: '"YeeYi Alert 👻" <yeeyi.info@gmail.com>', // sender address
            to: "yeeyi.info@gmail.com", // list of receivers
            subject: "Something went wrong!", // Subject line
            html: content,
        }).then((info: { response: string }) => {
            Logger.log("发送邮件成功: " + JSON.stringify(info, null, 2))
        }).catch((err: Object) => {
            Logger.error(JSON.stringify(err))
        })
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
                if (post.token == null) {
                    this.onError(post, Error.NULL_TOKEN)
                }
            } catch (err) {
                post.timestamp = now + 10 * 60 * 1000 // 10 分钟后尝试
                if (err) {
                    Logger.error(`post ${post.tid} failed to get token ${JSON.stringify(err)}`)
                }
                this.onError(post, JSON.stringify(err))
                return
            }
        }
        try {
            const ret = await yeeyi.up(post.tid, post.token)
            if (ret.status != 0) {
                throw ret.message
            }
            const date = new Date(now)
            if (ret.times == null || ret.times == 0) {
                date.setDate(date.getDate() + 1)
                date.setHours(this.data.start, 0)
                post.timestamp = date.getTime()
                Logger.log(`post ${post.tid} 0 times left, next call ${getNowString(post.timestamp)}`)
                return
            }
            date.setHours(this.data.end)
            const diff = date.getTime() - now
            post.timestamp = now + (diff / ret.times) + (getRandomInt(0, 10) * 60 * 1000) // 10 分钟的偏差
            Logger.log(`post ${post.tid} ${ret.message}, next call ${getNowString(post.timestamp)}`)
        } catch (err) {
            post.token = ""
            post.timestamp = now + 10 * 60 * 1000 // 10 分钟后尝试
            Logger.error(`post ${post.tid} up failed ${JSON.stringify(err)}`)
            this.onError(post, JSON.stringify(err))
        }
    }

}

const upper = new Upper()
upper.init()
upper.start()