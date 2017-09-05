"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = {
    cyan: "\x1b[36m",
    gray: "\x1b[1;30m",
    error: "\x1b[1;31m"
};
const endColor = '\x1b[0m';
function print(txt, newLine = true, out, color) {
    out = out || process.stdout;
    let cmdColor = (color) ? colors[color] : null;
    if (cmdColor) {
        out.write(cmdColor);
        out.write(txt);
        out.write(endColor);
    }
    else {
        out.write(txt);
    }
    if (newLine) {
        out.write("\n");
    }
}
exports.print = print;
