"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_logging_1 = __importDefault(require("better-logging"));
better_logging_1.default(console);
const args = process.argv
    .filter((_, i) => i > 1) // the first 2 arguments are "node" and __filename
    .reduce((res, arg) => {
    const [key, val, ...shouldBeEmpty] = arg.split('=');
    if (shouldBeEmpty.length !== 0) {
        throw new Error('Command line arguments must be in the form of "key=value" or "key"');
    }
    res[key] = val || true; // allows boolean arguments to be written without "=true".
    return res;
}, {});
exports.args = args;
if (args.env === 'development') {
    // enable debug output
    console.loglevel = 4;
}
