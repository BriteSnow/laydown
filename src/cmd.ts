import { Partial } from "./utils";
import { ParsedArgs } from "minimist";
import { Origin, parseOrigin } from "./laydown";

export interface LayersContent {
	layers: {
		[name: string]: {
			files?: string[];
		}
	}
}


// --------- Cmd Types --------- //


export class Cmd {
	readonly cwd: string;

	constructor(cwd: string) {
		this.cwd = cwd;
	}
};


export class HelpCmd extends Cmd {

	readonly error?: string;
	readonly command?: string;

	constructor(cwd: string, cmd: ParsedArgs) {
		super(cwd);

		if (cmd._.length === 0) {
			this.error = "No command, please enter a command (see below)"
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
  - "lay ? _command_name_" to get more info on a command.`
	}
}


class SourcedLayeredCmd extends Cmd {
	readonly source: string;
	readonly layerName: string;

	constructor(cwd: string, cmd: ParsedArgs) {
		super(cwd);
		if (cmd._.length < 3) {
			throw new Error("COMMAND-WRONG-FORMAT - should have '_source_ _layer_name_'");
		}
		this.source = cmd._[1];
		this.layerName = cmd._[2];
	}

	get origin(): Origin {
		return parseOrigin(this.source);
	}
}

export class AddCmd extends SourcedLayeredCmd {

	readonly files: string[];

	constructor(cwd: string, cmd: ParsedArgs) {
		super(cwd, cmd);

		if (cmd._.length < 4) {
			throw new Error("COMMAND-ADD-WRONG-FORMAT - nothing to add, should add relative file paths");
		}

		this.files = (cmd._.length > 3) ? cmd._.slice(3) : [];
	}
}

export class DownCmd extends SourcedLayeredCmd {
	readonly source: string;
	readonly layerName: string;
	readonly distDir: string;


	constructor(pwd: string, cmd: ParsedArgs) {
		super(pwd, cmd);

		// set the distDir (by default it will be relative to cwd "./")
		this.distDir = (cmd._.length > 3) ? cmd._[3] : "./"
	}
}
// --------- /Cmd Types --------- //
