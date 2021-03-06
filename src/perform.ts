import path = require("path");
import fs = require("fs-extra-plus");
import { Cmd, AddCmd, DownCmd, HelpCmd, DescCmd, InitCmd } from "./cmd";
import { execAddCmd } from "./execAddCmd";
import { execDownCmd } from "./execDownCmd";
import { execHelpCmd } from "./execHelpCmd";
import { execDescCmd } from "./execDescCmd";
import { execInitCmd } from "./execInitCmd";

export async function exec(cmd: Cmd): Promise<any> {
	if (cmd instanceof AddCmd) {
		await execAddCmd(cmd);
	} else if (cmd instanceof DownCmd) {
		await execDownCmd(cmd);
	} else if (cmd instanceof HelpCmd) {
		await execHelpCmd(cmd);
	} else if (cmd instanceof DescCmd) {
		await execDescCmd(cmd);
	} else if (cmd instanceof InitCmd) {
		await execInitCmd(cmd);
	} else {
		throw Error("command not supported " + cmd.constructor.name);
	}
}










