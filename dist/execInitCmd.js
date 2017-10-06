"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra-plus");
const printer_1 = require("./printer");
async function execInitCmd(cmd) {
    // get the origin, add the default json file if no json file, and make sure it is full resolved
    let sourcePath = path.resolve(cmd.cwd, cmd.origin.path);
    sourcePath = path.resolve(sourcePath);
    const sourcePathInfo = path.parse(sourcePath);
    // Assert sure we do not init over a existing file
    const exists = await fs.pathExists(sourcePath);
    if (exists) {
        throw new Error(`laydown file already exist ${sourcePath}`);
    }
    // Assert the dir exist
    if (!(await fs.pathExists(sourcePathInfo.dir))) {
        throw new Error(`Cannot create laydown file: folder ${sourcePathInfo.dir} does not exists`);
    }
    const layersContent = {};
    if (cmd.baseDir) {
        layersContent.baseDir = cmd.baseDir;
    }
    // save
    await fs.writeJson(sourcePath, layersContent, { spaces: 2 });
    const relativeLayersJson = path.relative(cmd.cwd, sourcePath);
    // print the result heading
    printer_1.print(`Laydown created`, true, null, "cyan");
    const msg = [];
    msg.push(`  In       : '${cmd.origin.path}'`);
    msg.push(`  baseDir  : '${layersContent.baseDir}'`);
    printer_1.print(msg.join("\n"), true, null, "gray");
}
exports.execInitCmd = execInitCmd;
