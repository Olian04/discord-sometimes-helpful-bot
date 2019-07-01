"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const preStartConfig_1 = require("./preStartConfig");
const client = new discord_js_1.Client();
const commands = fs_1.default.readdirSync(path_1.default.join(__dirname, 'commands'))
    .filter((fileName) => fileName.endsWith('.js')) // excludes type files such as demo.d.ts
    .map((fileName) => require(path_1.default.join(__dirname, 'commands', fileName)).default);
client.on('ready', () => {
    console.log('Wont be ready.');
});
console.log(preStartConfig_1.args);
console.log(commands);
