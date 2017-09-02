import {Partial} from "./utils";
import minimist = require("minimist");

export class Cmd {
	readonly cwd: string;

	constructor(cwd: string){
		this.cwd = cwd;
	}
};

export function cmd_parse(cwd: string, argv: string[]): Cmd{
	var cmd = minimist(argv.slice(2), {"boolean": "g"});
	console.log("raw cmd: ", cmd);

	if (cmd._.length === 0){
		throw new Error("COMMAND-EMPTY");
	}

	let action = cmd._[0];
	
	switch(action){
		case "add":
			return new AddCmd(cwd, cmd);
		case "create-source":
			return new CreateSourceCmd(cwd, cmd);
		case "add-source":
			return new AddSourceCmd(cwd, cmd);
		default:
			throw new Error("COMMAND-NOT-RECOGNIZED")
	}
}

export class CreateSourceCmd extends Cmd {
	name: string;

	constructor(cwd: string, cmd: minimist.ParsedArgs){
		super(cwd);
		if (cmd._.length < 2){
			throw new Error("COMMAND-CREATESOURCE-WRONG-FORMAT");
		}
		this.name = cmd._[1];
	}
}

export class AddSourceCmd extends Cmd {
	origin: string;
	name?: string;

	constructor(cwd: string, cmd: minimist.ParsedArgs){
		super(cwd);
		if (cmd._.length < 2){
			throw new Error("COMMAND-ADDSOURCE-WRONG-FORMAT");
		}
		this.origin = cmd._[1];

		if (cmd.name){
			this.name = cmd.name;
		}
	}
}

export class AddCmd extends Cmd{
	readonly source: string;
	readonly layerName: string;
	readonly files: string[];

	constructor(pwd: string, cmd: minimist.ParsedArgs){
		super(pwd);

		if (cmd._.length < 3){
			throw new Error("COMMAND-ADD-WRONG-FORMAT");
		}

		this.source = cmd._[1];
		this.layerName = cmd._[2];

		this.files = (cmd._.length > 3)?cmd._.slice(3):[];
	}
}



