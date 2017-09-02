"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra");
const cmd_parse_1 = require("./cmd_parse");
async function exec(cmd) {
    if (cmd instanceof cmd_parse_1.AddCmd) {
        execAddCmd(cmd);
    }
    else {
        throw Error("command not supported " + cmd.constructor.name);
    }
}
exports.exec = exec;
async function execAddCmd(addCmd) {
    console.log(`Going to execute`, addCmd);
    // get the source, add the default json file if no json file, and make sure it is full resolved
    let sourcePath = path.resolve(addCmd.source);
    sourcePath = sourcePath.endsWith(".json") ? sourcePath : sourcePath + "/laydown-layers.json";
    sourcePath = path.resolve(sourcePath);
    let sourceInfo = path.parse(sourcePath);
    // resolve the files as relative to 
    var files = addCmd.files.map((f) => {
        let rel = path.relative(sourceInfo.dir, f);
        return rel;
    });
    console.log("will add to file: " + sourcePath + "\n\tfiles:", files);
    var layersContent = {};
    // Load or create new layersContent
    if (!fs.pathExists(sourcePath)) {
        layersContent = await fs.readJson(sourcePath);
    }
    else {
        layersContent = {
            layers: {}
        };
    }
}
