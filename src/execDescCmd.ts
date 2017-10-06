import path = require("path");
import fs = require("fs-extra-plus");
import { DescCmd, LayersContent } from "./cmd";
import { Laydown, loadLaydown } from "./laydown";
import { print } from "./printer";

/**
 * 
 * TODO: Add support So far only support origin.type = "fs"
 */
export async function execDescCmd(descCmd: DescCmd) {

	// Get the origin (so far assume "fs" origin type)
	const laydown = await loadLaydown(descCmd.cwd, descCmd.origin);
	const baseDir = laydown.resolvedBaseDir;

	const relFile = path.relative(descCmd.cwd, laydown.file);

	print(`desc ${relFile}`, true, null, "cyan");
	print(`  baseDir ${baseDir}`, true, null, "gray");
	const msg = [];
	for (let name of laydown.layerNames) {
		msg.push(`  - layer: ${name}:`);
		for (let fi of await laydown.getFileInfos(name)) {
			let line = `    - ${fi.path} `;
			if (fi.isGlob) {
				line += `(${fi.absolutePaths.length} files)`;
			} else {
				line += (fi.absolutePaths.length > 0) ? '(exist)' : '(does not exist)';
			}
			msg.push(line);
		}
	}
	print(msg.join("\n"), true, null, "gray");

}