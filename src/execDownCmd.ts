import path = require("path");
import fs = require("fs-extra-plus");
import { DownCmd, LayersContent } from "./cmd";
import { Laydown, loadLaydown } from "./laydown";
import { print } from "./printer";

/**
 * 
 * TODO: Add support So far only support origin.type = "fs"
 */
export async function execDownCmd(downCmd: DownCmd) {

	// Get the origin (so far assume "fs" origin type)
	var laydown = await loadLaydown(downCmd.cwd, downCmd.origin);

	let srcDir = path.resolve(downCmd.cwd, downCmd.origin.pathDir);
	let dstDir = path.resolve(downCmd.cwd, downCmd.distDir);

	// console.log("srcDir: " + srcDir);
	// console.log("dstDir: " + dstDir);
	// console.log("Loaded laydown:\n" + laydown.toString());

	let copiedFiles: { file: string, overwrite: boolean }[] = [];

	for (let f of laydown.getFiles(downCmd.layerName)) {
		let srcFile = path.join(srcDir, f);
		let dstFile = path.join(dstDir, f);

		let exists = await fs.pathExists(dstFile);

		await fs.copy(srcFile, dstFile);

		copiedFiles.push({ file: f, overwrite: exists });
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