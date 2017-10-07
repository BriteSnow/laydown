import { HelpCmd } from './cmd';
import { print } from './printer';
import * as fs from 'fs-extra-plus';
import * as path from 'path';



export async function execHelpCmd(cmd: HelpCmd) {

	if (cmd.error) {
		print(cmd.error, true, null, "error")
	}

	// print new line
	print('', true);

	// print help
	const packageFile = path.join(__dirname, '../package.json');
	var version = (await fs.readJson(packageFile)).version;
	print(getHelpText(version));
}

function getHelpText(version: string) {
	return `laydown version ${version} 
  - 'lay init [_base_dir_]' create a './laydown.json' with a optional base dir.
  - 'lay add _layer_name_ _files,..._': add a layer (if does not exists) and append files. (use the closest laydown.json)
  - 'lay desc _layer_name_' describe a layer (use the closest laydown.json)
  - 'lay down /path/to/laydown/dir/ _layer_name_ [_dist_dir_]' download the layer's files for a laydown file into a optional dist_dir (default dist_dir: './')`;
}
