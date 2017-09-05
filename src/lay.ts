import { parse } from './parser';
import { exec } from './perform';

// import {laydown} from "./index" 'another';

export async function lay(cwd: string, argv: string[]): Promise<any> {
	var cmd = parse(cwd, argv);
	return await exec(cmd);
}