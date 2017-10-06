import { Partial } from "./utils";
import { ParsedArgs } from "minimist";
import { Origin, parseOrigin } from "./laydown";
import minimist = require("minimist");
import * as fs from 'fs-extra';
import * as path from 'path';

export interface LayersContent {
	baseDir?: string,
	layers?: {
		[name: string]: {
			files?: string[];
		}
	}
}

// --------- Cmd Types --------- //


export class Cmd {
	readonly cwd: string;
	readonly args: ParsedArgs;

	constructor(cwd: string, args: ParsedArgs) {
		this.cwd = cwd;
		this.args = args;
	}

	async init() { }
};


export class HelpCmd extends Cmd {

	error?: string;
	command?: string;

	async init() {
		await super.init();

		if (this.args._.length === 0) {
			this.error = "No command, please enter a command (see below)"
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
  - "lay ? _command_name_" to get more info on a command.`
	}
}


/**
 * Base class for commands that requires a source, this will look for the closest source,
 * and create the Origin
 */
export class SourcedCmd extends Cmd {
	source: string;

	async init(sourceOverride?: string) {
		await super.init();
		let source: string | null = null;

		source = await findLaydownFile(this.cwd, sourceOverride || '.');

		if (source === null) {
			throw new Error(`Cannot find 'laydown.json' from directory ${this.cwd} or ${sourceOverride}`);
		}
		this.source = source;
	}

	get origin(): Origin {
		return parseOrigin(this.source);
	}
}

/**
 * Base class for commands that have srouce and a layerName
 */
export class SourcedLayeredCmd extends SourcedCmd {
	layerName: string;

	async init() {
		await super.init();

		if (this.args._.length < 1) {
			throw new Error("COMMAND-WRONG-FORMAT - should have '_layer_name_'");
		}
		this.layerName = this.args._[1];
	}
}

export class AddCmd extends SourcedLayeredCmd {

	readonly files: string[];

	constructor(cwd: string, cmd: ParsedArgs) {
		super(cwd, cmd);

		if (cmd._.length < 3) {
			throw new Error("COMMAND-ADD-WRONG-FORMAT - nothing to add, should add relative file paths");
		}

		this.files = (cmd._.length > 2) ? cmd._.slice(2) : [];
	}
}

// Note: here we get the source manually, because it is not auto find
export class DownCmd extends SourcedCmd {

	layerName: string;
	distDir: string;

	async init() {
		if (this.args._.length < 2) {
			throw new Error(`source missing, should be 'lay down . myLayer'`);
		}
		const source = this.args._[1];

		if (this.args._.length < 3) {
			throw new Error(`layer_name missing, should be 'lay down . myLayer'`);
		}
		this.layerName = this.args._[2];

		this.distDir = (this.args._.length > 3) ? this.args._[3] : "./"

		// we init at the end in this case (Note: this might be an anti pattern)
		await super.init(source);
	}
}

export class DescCmd extends SourcedCmd {
}


/**
 * 'lay init [source_dir] [base_dir]`
 * - `source_dir` (optional) is the directory of the `laydown.json` to be created (default `./`) 
 * - `base_dir` (option) is the `.baseDir` for this `ladyown.json` relative to the `laydown.json` file (default `./`)
 * 
 * Note: This class does not extend SourcedCmd as it creates a `laydown.json` and `SourcedCmd` find the closest `laydown.json`
 */
export class InitCmd extends Cmd {
	source?: string;
	baseDir?: string;
	origin: Origin;

	async init() {
		await super.init();

		// the second optional arg is the baseDir
		this.source = (this.args._.length > 1) ? this.args._[1] : './';
		this.origin = parseOrigin(this.source);

		// the second optional arg is the baseDir
		this.baseDir = (this.args._.length > 2) ? this.args._[2] : './';
	}

}
// --------- /Cmd Types --------- //

/** 
 * Try to find a laydown files where loc can be 
 *   - '.' for closest, 
 *   - './some/path/to/dir' for relative to dir or json file (relative to cwd)
 *   - '/absolute/path.json' for direct json file
 *  @returns file path if found, null if not.
 * */
async function findLaydownFile(cwd: string, loc: string): Promise<string | null> {
	// if we have a '.' then we do the closest
	if (loc === '.') {
		return closestSource(cwd);
	}

	// resolve the relative or absolute loc pth from cwd
	let fullPath = (!path.isAbsolute(loc)) ? path.join(cwd, loc) : loc;

	// if it ends with '.json' then it is a direct
	if (fullPath.endsWith('.json')) {
		return (await fs.pathExists(fullPath)) ? fullPath : null;
	} else {
		fullPath = path.join(fullPath, 'laydown.json');
		return (await fs.pathExists(fullPath)) ? fullPath : null;
	}
}

async function closestSource(dir: string) {
	let closestDir: string | null = dir;
	do {
		const source = path.join(closestDir, 'laydown.json');
		const exists = await fs.pathExists(source);
		if (exists) {
			return source;
		}
		let parentDir: string | null = path.join(closestDir, '../') || null;

		// if the parentDir is same as previous parentDir, then, we are at the root
		if (parentDir === closestDir) {
			return null;
		}
		closestDir = parentDir;
	} while (closestDir !== null);

	return null;
}


// --------- Parsing --------- //
type CmdAble = new (cwd: string, args: ParsedArgs) => Cmd;

const actionToClass: { [action: string]: CmdAble } = {
	'add': AddCmd,
	'down': DownCmd,
	'desc': DescCmd,
	'init': InitCmd
}

export async function parse(cwd: string, argv: string[]): Promise<Cmd> {
	const args = minimist(argv.slice(2), { "boolean": "g" });

	if (args._.length === 0) {
		return new HelpCmd(cwd, args);
	}
	let action = args._[0];

	const cmdClass: CmdAble = actionToClass[action] || HelpCmd;
	const cmd = new cmdClass(cwd, args);

	await cmd.init();

	return cmd;
}
// --------- /Parsing --------- //