import path = require("path");
import fs = require("fs-extra-plus");
import { DownCmd, LayersContent } from "./cmd";
import { Laydown, loadLaydown, FileInfo } from "./laydown";
import { print } from "./printer";
import { prompt } from './prompt';
import minimatch = require("minimatch");

/**
 * 
 * TODO: Add support So far only support origin.type = "fs"
 */
export async function execDownCmd(downCmd: DownCmd) {

	// Get the origin (so far assume "fs" origin type)
	var laydown = await loadLaydown(downCmd.cwd, downCmd.origin);

	let srcDir = path.resolve(downCmd.cwd, downCmd.origin.pathDir);
	let dstDir = path.resolve(downCmd.cwd, downCmd.distDir);

	const replacers = laydown.replacers;
	const replacersValues: { [name: string]: string } = {};
	// get the values for each replacers
	if (replacers) {
		for (const name in replacers) {
			replacersValues[name] = await prompt(`${name}: `)
		}
	}

	let copiedFiles: { file: string, overwrite: boolean }[] = [];

	// for each file rule (could be a direct file path or glob)
	for (let fi of await laydown.getFileInfos(downCmd.layerName)) {

		// for each file
		for (let f of fi.absolutePaths) {
			const srcFile = f;

			// the relative source file to the laydown baseDir
			const relativeSrcFile = path.relative(laydown.resolvedBaseDir, f);

			// by default, the destination relative path is the same (can be change by path replacers)
			let dstRelativePath = relativeSrcFile;

			let textContent = null; // in case of a content replacer
			if (replacers) {
				for (const name in replacers) {
					const value = replacersValues[name];
					const replacer = replacers[name];

					// if we have a path glob filter list, at last one need to match
					if (replacer.only) {
						let pass = false;
						for (const m of replacer.only) {
							pass = pass || minimatch(srcFile, m);
						}
						if (!pass) {
							continue;
						}

					}

					// for each regex
					for (const rgx of replacer.rgx) {

						switch (replacer.type) {
							case 'path':
								dstRelativePath = dstRelativePath.replace(rgx, value);
								break;
							case 'content':
								if (textContent === null) {
									textContent = await fs.readFile(srcFile, 'utf8');
								}
								textContent = textContent.replace(rgx, value);
						}
					}
				}
			}

			let dstFile = path.join(dstDir, dstRelativePath);

			let exists = await fs.pathExists(dstFile);


			// if we have a textContent, we write it rather than the original file content
			if (textContent !== null) {
				await fs.mkdirs(path.dirname(dstFile));
				await fs.writeFile(dstFile, textContent, { encoding: 'utf8' });
			}
			// otherwise, we just copy the file
			else {
				await fs.copy(srcFile, dstFile);
			}


			copiedFiles.push({ file: dstRelativePath, overwrite: exists });
		}
	}

	print(`Layer '${downCmd.layerName}' downloaded:`, true, null, "cyan");
	var msg = [];
	msg.push(`  From  : '${downCmd.origin.path}'`);
	msg.push(`  To    : '${downCmd.distDir}`);
	msg.push("  Files :");

	for (let finfo of copiedFiles) {
		msg.push(`    - ${finfo.file} (${(finfo.overwrite) ? "udpated" : "added"})`);
	}

	print(msg.join("\n"), true, null, "gray");

}