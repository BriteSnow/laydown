import { cmd_parse } from './cmd_parse';
import { exec } from './perform';

// import {laydown} from "./index" 'another';

export async function lay(cwd: string, argv: string[]): Promise<any> {
	var cmd = cmd_parse(cwd, argv);
	return await exec(cmd);
}