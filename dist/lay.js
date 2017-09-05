"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const perform_1 = require("./perform");
// import {laydown} from "./index" 'another';
async function lay(cwd, argv) {
    var cmd = parser_1.parse(cwd, argv);
    return await perform_1.exec(cmd);
}
exports.lay = lay;
