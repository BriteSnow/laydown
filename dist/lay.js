"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_1 = require("./cmd");
const perform_1 = require("./perform");
// import {laydown} from "./index" 'another';
/** perform a lay command based on the dir `cwd` and command line `argv`
 * @param argv either the array of all cli argument including first command string, or string that will be .split(' ')
 */
async function lay(cwd, argv) {
    argv = (argv instanceof Array) ? argv : argv.split(' ');
    var cmd = await cmd_1.parse(cwd, argv);
    return await perform_1.exec(cmd);
}
exports.lay = lay;
