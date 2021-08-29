"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.write = exports.read = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var FilePath = path_1.default.join(".", "db.json");
function read() {
    var content = fs_1.default.readFileSync(FilePath, { encoding: "utf-8" });
    return JSON.parse(content);
}
exports.read = read;
function write(data) {
    fs_1.default.writeFileSync(FilePath, JSON.stringify(data));
}
exports.write = write;
