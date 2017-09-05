import minimist = require("minimist");
import { Cmd, AddCmd, DownCmd, HelpCmd } from "./cmd";
import { print } from "./printer";

export function parse(cwd: string, argv: string[]): Cmd {
	var cmd = minimist(argv.slice(2), { "boolean": "g" });

	if (cmd._.length === 0) {
		return new HelpCmd(cwd, cmd);
	}

	let action = cmd._[0];

	switch (action) {
		case "add":
			return new AddCmd(cwd, cmd);
		case "down":
			return new DownCmd(cwd, cmd);
		default:
			return new HelpCmd(cwd, cmd);
	}
}