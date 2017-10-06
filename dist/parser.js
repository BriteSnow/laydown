"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
const cmd_1 = require("./cmd");
function parse(cwd, argv) {
    var cmd = minimist(argv.slice(2), { "boolean": "g" });
    if (cmd._.length === 0) {
        return new cmd_1.HelpCmd(cwd, cmd);
    }
    let action = cmd._[0];
    switch (action) {
        case "add":
            return new cmd_1.AddCmd(cwd, cmd);
        case "down":
            return new cmd_1.DownCmd(cwd, cmd);
        case "desc":
            return new cmd_1.DescCmd(cwd, cmd);
        case "create":
            return new cmd_1.CreateCmd(cwd, cmd);
        default:
            return new cmd_1.HelpCmd(cwd, cmd);
    }
}
exports.parse = parse;
