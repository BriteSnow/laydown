"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd_parse_1 = require("./cmd_parse");
const perform_1 = require("./perform");
// import {laydown} from "./index" 'another';
async function lay(cwd, argv) {
    var cmd = cmd_parse_1.cmd_parse(cwd, argv);
    return await perform_1.exec(cmd);
}
exports.lay = lay;
