"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getNowString = void 0;
var db = __importStar(require("./db"));
var yeeyi = __importStar(require("./yeeyi"));
var colors_1 = __importDefault(require("colors"));
/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getNowString(timestamp) {
    var date = timestamp ? new Date(timestamp) : new Date();
    var offset = date.getTimezoneOffset();
    var now = new Date(date.getTime() - (offset * 60 * 1000));
    return now.toISOString();
}
exports.getNowString = getNowString;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.log = function (message) {
        console.info(colors_1.default.yellow(getNowString()), colors_1.default.green("[INFO]"), message);
    };
    Logger.error = function (message) {
        console.error(colors_1.default.yellow(getNowString()), colors_1.default.green("[ERROR}"), colors_1.default.red(message));
    };
    return Logger;
}());
var Upper = /** @class */ (function () {
    function Upper() {
    }
    Upper.prototype.init = function () {
        this.data = db.read();
    };
    Upper.prototype.start = function () {
        var _this = this;
        if (this.data == null) {
            return;
        }
        var check = function () {
            try {
                _this.check();
            }
            catch (err) {
                if (err) {
                    Logger.error(err.message || err);
                }
            }
        };
        Logger.log("starting");
        Logger.log("update interval " + this.data.checkInterval + "s");
        check();
        setInterval(function () {
            check();
        }, this.data.checkInterval * 1000);
    };
    Upper.prototype.check = function () {
        return __awaiter(this, void 0, void 0, function () {
            var date, hour, now, posts, postToUsed;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.data == null) {
                            return [2 /*return*/];
                        }
                        date = new Date();
                        hour = date.getHours();
                        if (!(hour >= 8 && hour <= 19)) {
                            return [2 /*return*/];
                        }
                        now = date.getTime();
                        posts = this.data.posts;
                        postToUsed = posts.filter(function (post) {
                            return post.timestamp == null || now >= post.timestamp;
                        });
                        Logger.log("checking posts, " + postToUsed.length + " posts are ready to up");
                        return [4 /*yield*/, Promise.all(postToUsed.map(function (post) { return _this.checkPost(post, now); }))];
                    case 1:
                        _a.sent();
                        if (postToUsed.length > 0) {
                            Logger.log("writing to file");
                            try {
                                db.write(this.data);
                            }
                            catch (err) {
                                if (err) {
                                    Logger.error("failed to write " + (err.message || err));
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Upper.prototype.checkPost = function (post, now) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_1, ret, curHour, diff, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.data == null) {
                            return [2 /*return*/];
                        }
                        if (!!post.token) return [3 /*break*/, 4];
                        Logger.log("post " + post.tid + " not exists");
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = post;
                        return [4 /*yield*/, yeeyi.login(post.username, post.password)];
                    case 2:
                        _a.token = _b.sent();
                        Logger.log("post " + post.tid + " got token " + post.token);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        post.timestamp = now + 10 * 60 * 1000; // 10 分钟后尝试
                        if (err_1) {
                            Logger.error("post " + post.tid + " failed to get token " + JSON.stringify(err_1));
                        }
                        return [2 /*return*/];
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, yeeyi.up(post.tid, post.token)];
                    case 5:
                        ret = _b.sent();
                        curHour = new Date(now).getHours();
                        diff = (this.data.end - curHour) * 60 * 1000;
                        post.timestamp = now + diff / ret.times + (getRandomInt(-5, 5) * 60 * 1000); // 正负 5 分钟的偏差
                        Logger.log("post " + post.tid + " " + ret.message + ", next call " + getNowString(post.timestamp));
                        return [3 /*break*/, 7];
                    case 6:
                        err_2 = _b.sent();
                        post.token = "";
                        post.timestamp = now + 10 * 60 * 1000; // 10 分钟后尝试
                        Logger.error("post " + post.tid + " up failed " + JSON.stringify(err_2));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return Upper;
}());
var upper = new Upper();
upper.init();
upper.start();
