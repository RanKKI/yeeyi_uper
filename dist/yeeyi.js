"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = exports.login = void 0;
var axios_1 = __importDefault(require("axios"));
var https_proxy_agent_1 = require("https-proxy-agent");
var agent = new https_proxy_agent_1.HttpsProxyAgent('http://127.0.0.1:7890');
function login(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    axios_1.default.post('https://www.yeeyi.com/api/login/', {
                        username: username,
                        password: password
                    }, {
                        httpsAgent: agent,
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
                    }).then(function (res) {
                        resolve(res.data.authcode);
                    }).catch(function (err) {
                        reject(err);
                    });
                })];
        });
    });
}
exports.login = login;
function up(postID, token) {
    return new Promise(function (resolve, reject) {
        axios_1.default.post('https://www.yeeyi.com/api/upVote/', {
            tid: postID,
            authcode: token
        }, {
            httpsAgent: agent,
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
        }).then(function (res) {
            resolve(res.data);
        }).catch(function (err) {
            reject(err);
        });
    });
}
exports.up = up;
