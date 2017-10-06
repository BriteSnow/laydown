"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra-plus");
const printer_1 = require("./printer");
async function execCreateCmd(cmd) {
    // get the origin, add the default json file if no json file, and make sure it is full resolved
    let sourcePath = path.resolve(cmd.cwd, cmd.origin.path);
    sourcePath = path.resolve(sourcePath);
    let sourcePathInfo = path.parse(sourcePath);
    var layersContent;
    // Load or create new layersContent
    var exists = await fs.pathExists(sourcePath);
    if (exists) {
        throw new Error(`laydown file already exist ${sourcePath}`);
    }
    var layersContent = {};
    if (cmd.baseDir) {
        layersContent.baseDir = cmd.baseDir;
    }
    // save
    await fs.writeJson(sourcePath, layersContent, { spaces: 2 });
    const relativeLayersJson = path.relative(cmd.cwd, sourcePath);
    // print the result heading
    printer_1.print(`Laydown created`, true, null, "cyan");
    var msg = [];
    msg.push(`  In       : '${cmd.origin.path}'`);
    msg.push(`  baseDir  : '${layersContent.baseDir}'`);
    printer_1.print(msg.join("\n"), true, null, "gray");
}
exports.execCreateCmd = execCreateCmd;
