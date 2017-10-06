"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
function prompt(msg) {
    return new Promise(function (resolve, reject) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(msg, (answer) => {
            resolve(answer);
            rl.close();
        });
    });
}
exports.prompt = prompt;
