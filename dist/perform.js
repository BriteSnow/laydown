"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("./cmd");
const execAddCmd_1 = require("./execAddCmd");
const execDownCmd_1 = require("./execDownCmd");
const execHelpCmd_1 = require("./execHelpCmd");
const execDescCmd_1 = require("./execDescCmd");
const execInitCmd_1 = require("./execInitCmd");
async function exec(cmd) {
    if (cmd instanceof cmd_1.AddCmd) {
        await execAddCmd_1.execAddCmd(cmd);
    }
    else if (cmd instanceof cmd_1.DownCmd) {
        await execDownCmd_1.execDownCmd(cmd);
    }
    else if (cmd instanceof cmd_1.HelpCmd) {
        await execHelpCmd_1.execHelpCmd(cmd);
    }
    else if (cmd instanceof cmd_1.DescCmd) {
        await execDescCmd_1.execDescCmd(cmd);
    }
    else if (cmd instanceof cmd_1.InitCmd) {
        await execInitCmd_1.execInitCmd(cmd);
    }
    else {
        throw Error("command not supported " + cmd.constructor.name);
    }
}
exports.exec = exec;
