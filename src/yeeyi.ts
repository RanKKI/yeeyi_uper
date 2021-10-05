import axios from 'axios';
export async function login(username: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.post('https://www.yeeyi.com/api/login/',
            {
                username: username,
                password: password
            },
            {
                headers: {
                    "host": "www.yeeyi.com",
                    'authority': 'www.yeeyi.com',
                    'pragma': 'no-cache',
                    'cache-control': 'no-cache',
                    'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Microsoft Edge";v="92"',
                    'accept': 'application/json, text/plain, */*',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 Edg/92.0.902.78',
                    'content-type': 'application/json;charset=UTF-8',
                    'origin': 'https://www.yeeyi.com',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://www.yeeyi.com/login/?option=3&goback=1',
                    'accept-language': 'en-AU,en-GB;q=0.9,en;q=0.8,en-US;q=0.7,zh-CN;q=0.6,zh-TW;q=0.5,zh;q=0.4',
                    'Content-Type': 'application/json; charset=UTF-8'
                },
            }
        ).then(res => {
            resolve(res.data.authcode)
        }).catch(err => {
            reject(err)
        })
    })
}

export function up(postID: number, token: string): Promise<{ times: number, message: string, status: number }> {
    return new Promise((resolve, reject) => {
        axios.post('https://www.yeeyi.com/api/upVote/',
            {
                tid: postID,
                authcode: token,
                devid: "6def75e-b4f5-24bc-6724-43cb13e4dd3c|pc"
            },
            {
                headers: {
                    "host": "www.yeeyi.com",
                    'authority': 'www.yeeyi.com',
                    'pragma': 'no-cache',
                    'cache-control': 'no-cache',
                    'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Microsoft Edge";v="92"',
                    'accept': 'application/json, text/plain, */*',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 Edg/92.0.902.78',
                    'content-type': 'application/json;charset=UTF-8',
                    'origin': 'https://www.yeeyi.com',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'referer': 'https://www.yeeyi.com/login/?option=3&goback=1',
                    'accept-language': 'en-AU,en-GB;q=0.9,en;q=0.8,en-US;q=0.7,zh-CN;q=0.6,zh-TW;q=0.5,zh;q=0.4',
                    'Content-Type': 'application/json; charset=UTF-8'
                },
            }
        ).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}