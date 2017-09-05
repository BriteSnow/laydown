"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const laydown_1 = require("./laydown");
// --------- Cmd Types --------- //
class Cmd {
    constructor(cwd) {
        this.cwd = cwd;
    }
}
exports.Cmd = Cmd;
;
class HelpCmd extends Cmd {
    constructor(cwd, cmd) {
        super(cwd);
        if (cmd._.length === 0) {
            this.error = "No command, please enter a command (see below)";
            return;
        }
        // if we are here and no "?" as first arg, we have it wrong
        if (cmd._[0] !== "?") {
            this.error = "Unknown command " + cmd._;
            return;
        }
        if (cmd._.length > 2) {
            this.command = cmd._[1];
        }
    }
    getHelp() {
        return `Getting started: 
  - 'lay source git://github.com/laydown-io/lean-web-app' to setup the 'lean-web-app' source alias.
  - 'lay down lean-web-app base' to download the 'base' layer from the 'lean-web-app' source.
  - 'lay desc lean-web-app' to describe the layers of this source.
  - 'lay ??' to open "https://laydown.io"
Commands: 
  - "lay source _origin_ [_optional_source_name_]": add a named source name alias to an origin (source_name required if not in the origin laydown.json.
  - "lay down _source_": download a layer from a source (source name or origin).
  - "lay add _source_ _layer_name_ _files_": Create or add to an existing layer.
  - "lay desc _source_ [_layer_name_]": Describe a source or layer.
  - "lay ? _command_name_" to get more info on a command.`;
    }
}
exports.HelpCmd = HelpCmd;
class SourcedLayeredCmd extends Cmd {
    constructor(cwd, cmd) {
        super(cwd);
        if (cmd._.length < 3) {
            throw new Error("COMMAND-WRONG-FORMAT - should have '_source_ _layer_name_'");
        }
        this.source = cmd._[1];
        this.layerName = cmd._[2];
    }
    get origin() {
        return laydown_1.parseOrigin(this.source);
    }
}
class AddCmd extends SourcedLayeredCmd {
    constructor(cwd, cmd) {
        super(cwd, cmd);
        if (cmd._.length < 4) {
            throw new Error("COMMAND-ADD-WRONG-FORMAT - nothing to add, should add relative file paths");
        }
        this.files = (cmd._.length > 3) ? cmd._.slice(3) : [];
    }
}
exports.AddCmd = AddCmd;
class DownCmd extends SourcedLayeredCmd {
    constructor(pwd, cmd) {
        super(pwd, cmd);
        // set the distDir (by default it will be relative to cwd "./")
        this.distDir = (cmd._.length > 3) ? cmd._[3] : "./";
    }
}
exports.DownCmd = DownCmd;
// --------- /Cmd Types --------- //
