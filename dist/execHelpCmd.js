"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const printer_1 = require("./printer");
async function execHelpCmd(cmd) {
    if (cmd.error) {
        printer_1.print(cmd.error, true, null, "error");
    }
    // print new line
    printer_1.print("", true);
    // print help
    printer_1.print(cmd.getHelp());
}
exports.execHelpCmd = execHelpCmd;
