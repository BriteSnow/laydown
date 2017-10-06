import { parse } from './cmd';
import { exec } from './perform';

// import {laydown} from "./index" 'another';

/** perform a lay command based on the dir `cwd` and command line `argv`
 * @param argv either the array of all cli argument including first command string, or string that will be .split(' ')
 */
export async function lay(cwd: string, argv: string[] | string): Promise<any> {
	argv = (argv instanceof Array) ? argv : argv.split(' ');

	var cmd = await parse(cwd, argv);

	return await exec(cmd);
}