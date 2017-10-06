"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const laydown_1 = require("./laydown");
const printer_1 = require("./printer");
/**
 *
 * TODO: Add support So far only support origin.type = "fs"
 */
async function execDescCmd(descCmd) {
    // Get the origin (so far assume "fs" origin type)
    const laydown = await laydown_1.loadLaydown(descCmd.cwd, descCmd.origin);
    const baseDir = laydown.resolvedBaseDir;
    const relFile = path.relative(descCmd.cwd, laydown.file);
    printer_1.print(`desc ${relFile}`, true, null, "cyan");
    printer_1.print(`  baseDir ${baseDir}`, true, null, "gray");
    const msg = [];
    for (let name of laydown.layerNames) {
        msg.push(`  - layer: ${name}:`);
        for (let fi of await laydown.getFileInfos(name)) {
            let line = `    - ${fi.path} `;
            if (fi.isGlob) {
                line += `(${fi.absolutePaths.length} files)`;
            }
            else {
                line += (fi.absolutePaths.length > 0) ? '(exist)' : '(does not exist)';
            }
            msg.push(line);
        }
    }
    printer_1.print(msg.join("\n"), true, null, "gray");
}
exports.execDescCmd = execDescCmd;
