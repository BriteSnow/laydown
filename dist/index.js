"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var laydown;
(function (laydown) {
    async function down(args) {
    }
    laydown.down = down;
})(laydown = exports.laydown || (exports.laydown = {}));
function foo() {
    console.log("boo!");
}
exports.foo = foo;
class GitExporter {
    async download(path) {
        await wait(2000);
        return "downloaded path: " + path;
    }
}
exports.GitExporter = GitExporter;
async function wait(ms) {
    return new Promise((resolve, regject) => {
        setTimeout(() => resolve(), ms);
    });
}
