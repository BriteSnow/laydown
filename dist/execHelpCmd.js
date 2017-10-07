"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const printer_1 = require("./printer");
const fs = require("fs-extra-plus");
const path = require("path");
async function execHelpCmd(cmd) {
    if (cmd.error) {
        printer_1.print(cmd.error, true, null, "error");
    }
    // print new line
    printer_1.print('', true);
    // print help
    const packageFile = path.join(__dirname, '../package.json');
    var version = (await fs.readJson(packageFile)).version;
    printer_1.print(getHelpText(version));
}
exports.execHelpCmd = execHelpCmd;
function getHelpText(version) {
    return `laydown version ${version} 
  - 'lay init [_base_dir_]' create a './laydown.json' with a optional base dir.
  - 'lay add _layer_name_ _files,..._': add a layer (if does not exists) and append files. (use the closest laydown.json)
  - 'lay desc _layer_name_' describe a layer (use the closest laydown.json)
  - 'lay down /path/to/laydown/dir/ _layer_name_ [_dist_dir_]' download the layer's files for a laydown file into a optional dist_dir (default dist_dir: './')`;
}
