import { HelpCmd } from "./cmd";
import { print } from "./printer";


export async function execHelpCmd(cmd: HelpCmd) {

	if (cmd.error) {
		print(cmd.error, true, null, "error")
	}

	// print new line
	print("", true);

	// print help
	print(cmd.getHelp());

}