"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra-plus");
const laydown_1 = require("./laydown");
const printer_1 = require("./printer");
/**
 *
 * TODO: Add support So far only support origin.type = "fs"
 */
async function execDownCmd(downCmd) {
    // Get the origin (so far assume "fs" origin type)
    var laydown = await laydown_1.loadLaydown(downCmd.cwd, downCmd.origin);
    let srcDir = path.resolve(downCmd.cwd, downCmd.origin.pathDir);
    let dstDir = path.resolve(downCmd.cwd, downCmd.distDir);
    // console.log("srcDir: " + srcDir);
    // console.log("dstDir: " + dstDir);
    // console.log("Loaded laydown:\n" + laydown.toString());
    let copiedFiles = [];
    for (let f of laydown.getFiles(downCmd.layerName)) {
        let srcFile = path.join(srcDir, f);
        let dstFile = path.join(dstDir, f);
        let exists = await fs.pathExists(dstFile);
        await fs.copy(srcFile, dstFile);
        copiedFiles.push({ file: f, overwrite: exists });
    }
    printer_1.print(`Layer '${downCmd.layerName}' downloaded:`, true, null, "cyan");
    var msg = [];
    msg.push(`  From  : '${downCmd.origin.path}'`);
    msg.push(`  To    : '${downCmd.distDir}`);
    msg.push("  Files :");
    for (let finfo of copiedFiles) {
        msg.push(`    - ${finfo.file} (${(finfo.overwrite) ? "udpated" : "added"})`);
    }
    printer_1.print(msg.join("\n"), true, null, "gray");
}
exports.execDownCmd = execDownCmd;
