"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const laydown_1 = require("./laydown");
const minimist = require("minimist");
const fs = require("fs-extra");
const path = require("path");
// --------- Cmd Types --------- //
class Cmd {
    constructor(cwd, args) {
        this.cwd = cwd;
        this.args = args;
    }
    async init() { }
}
exports.Cmd = Cmd;
;
class HelpCmd extends Cmd {
    async init() {
        await super.init();
        if (this.args._.length === 0) {
            this.error = "No command, please enter a command (see below)";
            return;
        }
        // if we are here and no "?" as first arg, we have it wrong
        if (this.args._[0] !== "?") {
            this.error = "Unknown command " + this.args._;
            return;
        }
        if (this.args._.length > 2) {
            this.command = this.args._[1];
        }
    }
}
exports.HelpCmd = HelpCmd;
/**
 * Base class for commands that requires a source, this will look for the closest source,
 * and create the Origin
 */
class SourcedCmd extends Cmd {
    async init(sourceOverride) {
        await super.init();
        let source = null;
        source = await findLaydownFile(this.cwd, sourceOverride || '.');
        if (source === null) {
            throw new Error(`Cannot find 'laydown.json' from directory ${this.cwd} or ${sourceOverride}`);
        }
        this.source = source;
    }
    get origin() {
        return laydown_1.parseOrigin(this.source);
    }
}
exports.SourcedCmd = SourcedCmd;
/**
 * Base class for commands that have srouce and a layerName
 */
class SourcedLayeredCmd extends SourcedCmd {
    async init() {
        await super.init();
        if (this.args._.length < 1) {
            throw new Error("COMMAND-WRONG-FORMAT - should have '_layer_name_'");
        }
        this.layerName = this.args._[1];
    }
}
exports.SourcedLayeredCmd = SourcedLayeredCmd;
class AddCmd extends SourcedLayeredCmd {
    constructor(cwd, cmd) {
        super(cwd, cmd);
        if (cmd._.length < 3) {
            throw new Error("COMMAND-ADD-WRONG-FORMAT - nothing to add, should add relative file paths");
        }
        this.files = (cmd._.length > 2) ? cmd._.slice(2) : [];
    }
}
exports.AddCmd = AddCmd;
// Note: here we get the source manually, because it is not auto find
class DownCmd extends SourcedCmd {
    async init() {
        if (this.args._.length < 2) {
            throw new Error(`source missing, should be 'lay down . myLayer'`);
        }
        const source = this.args._[1];
        if (this.args._.length < 3) {
            throw new Error(`layer_name missing, should be 'lay down . myLayer'`);
        }
        this.layerName = this.args._[2];
        this.distDir = (this.args._.length > 3) ? this.args._[3] : "./";
        // we init at the end in this case (Note: this might be an anti pattern)
        await super.init(source);
    }
}
exports.DownCmd = DownCmd;
class DescCmd extends SourcedCmd {
}
exports.DescCmd = DescCmd;
/**
 * 'lay init [source_dir] [base_dir]`
 * - `source_dir` (optional) is the directory of the `laydown.json` to be created (default `./`)
 * - `base_dir` (option) is the `.baseDir` for this `ladyown.json` relative to the `laydown.json` file (default `./`)
 *
 * Note: This class does not extend SourcedCmd as it creates a `laydown.json` and `SourcedCmd` find the closest `laydown.json`
 */
class InitCmd extends Cmd {
    async init() {
        await super.init();
        // the second optional arg is the baseDir
        this.source = (this.args._.length > 1) ? this.args._[1] : './';
        this.origin = laydown_1.parseOrigin(this.source);
        // the second optional arg is the baseDir
        this.baseDir = (this.args._.length > 2) ? this.args._[2] : './';
    }
}
exports.InitCmd = InitCmd;
// --------- /Cmd Types --------- //
/**
 * Try to find a laydown files where loc can be
 *   - '.' for closest,
 *   - './some/path/to/dir' for relative to dir or json file (relative to cwd)
 *   - '/absolute/path.json' for direct json file
 *  @returns file path if found, null if not.
 * */
async function findLaydownFile(cwd, loc) {
    // if we have a '.' then we do the closest
    if (loc === '.') {
        return closestSource(cwd);
    }
    // resolve the relative or absolute loc pth from cwd
    let fullPath = (!path.isAbsolute(loc)) ? path.join(cwd, loc) : loc;
    // if it ends with '.json' then it is a direct
    if (fullPath.endsWith('.json')) {
        return (await fs.pathExists(fullPath)) ? fullPath : null;
    }
    else {
        fullPath = path.join(fullPath, 'laydown.json');
        return (await fs.pathExists(fullPath)) ? fullPath : null;
    }
}
async function closestSource(dir) {
    let closestDir = dir;
    do {
        const source = path.join(closestDir, 'laydown.json');
        const exists = await fs.pathExists(source);
        if (exists) {
            return source;
        }
        let parentDir = path.join(closestDir, '../') || null;
        // if the parentDir is same as previous parentDir, then, we are at the root
        if (parentDir === closestDir) {
            return null;
        }
        closestDir = parentDir;
    } while (closestDir !== null);
    return null;
}
const actionToClass = {
    'add': AddCmd,
    'down': DownCmd,
    'desc': DescCmd,
    'init': InitCmd
};
async function parse(cwd, argv) {
    const args = minimist(argv.slice(2), { "boolean": "g" });
    if (args._.length === 0) {
        return new HelpCmd(cwd, args);
    }
    let action = args._[0];
    const cmdClass = actionToClass[action] || HelpCmd;
    const cmd = new cmdClass(cwd, args);
    await cmd.init();
    return cmd;
}
exports.parse = parse;
// --------- /Parsing --------- // 
