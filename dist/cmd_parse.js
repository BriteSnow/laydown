"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
class Cmd {
    constructor(pwd) {
        this.pwd = pwd;
    }
}
exports.Cmd = Cmd;
;
function cmd_parse(pwd, argv) {
    var cmd = minimist(argv.slice(2), { "boolean": "g" });
    console.log("raw cmd: ", cmd);
    if (cmd._.length === 0) {
        throw new Error("COMMAND-EMPTY");
    }
    let action = cmd._[0];
    switch (action) {
        case "add":
            return new AddCmd(pwd, cmd);
        case "create-source":
            return new CreateSourceCmd(pwd, cmd);
        case "add-source":
            return new AddSourceCmd(pwd, cmd);
        default:
            throw new Error("COMMAND-NOT-RECOGNIZED");
    }
}
exports.cmd_parse = cmd_parse;
class CreateSourceCmd extends Cmd {
    constructor(pwd, cmd) {
        super(pwd);
        if (cmd._.length < 2) {
            throw new Error("COMMAND-CREATESOURCE-WRONG-FORMAT");
        }
        this.name = cmd._[1];
    }
}
exports.CreateSourceCmd = CreateSourceCmd;
class AddSourceCmd extends Cmd {
    constructor(pwd, cmd) {
        super(pwd);
        if (cmd._.length < 2) {
            throw new Error("COMMAND-ADDSOURCE-WRONG-FORMAT");
        }
        this.origin = cmd._[1];
        if (cmd.name) {
            this.name = cmd.name;
        }
    }
}
exports.AddSourceCmd = AddSourceCmd;
class AddCmd extends Cmd {
    constructor(pwd, cmd) {
        super(pwd);
        if (cmd._.length < 3) {
            throw new Error("COMMAND-ADD-WRONG-FORMAT");
        }
        this.source = cmd._[1];
        this.layer = cmd._[2];
        this.files = (cmd._.length > 3) ? cmd._.slice(3) : [];
    }
}
exports.AddCmd = AddCmd;
