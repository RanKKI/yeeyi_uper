import fs from "fs"
import path from "path"

export interface LocalData {
    posts: Post[],
    checkInterval: number // 默认 10 s
    start: number,
    end: number
}

export interface Post {
    tid: number,
    timestamp?: number,
    token?: string,
    username: string,
    password: string,
    start?: number,
    end?: number,
}

const FilePath = path.join(".", "db.json")

export function read(): LocalData {
    const content = fs.readFileSync(FilePath, { encoding: "utf-8" })
    return JSON.parse(content)
}

export function write(data: LocalData) {
    fs.writeFileSync(FilePath, JSON.stringify(data))
}