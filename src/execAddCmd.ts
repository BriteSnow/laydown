import path = require('path');
import fs = require('fs-extra-plus');
import { AddCmd, LayersContent } from './cmd';
import { FileInfo, laydownJsonFileName, loadLaydown } from './laydown';
import { print } from './printer';
import { promisify } from 'util';
import globby = require('globby');

export async function execAddCmd(cmd: AddCmd) {

	// get the origin, add the default json file if no json file, and make sure it is full resolved
	let sourcePath = path.resolve(cmd.cwd, cmd.origin.path);
	sourcePath = path.resolve(sourcePath);
	let sourcePathInfo = path.parse(sourcePath);

	const laydown = await loadLaydown(cmd.cwd, cmd.origin, true);

	const layersContent: LayersContent = laydown.data;

	const fileInfos: { [path: string]: FileInfo } = {};

	// --------- Check that file exists --------- //
	let notFoundFiles: string[] = [];

	for (let f of cmd.files) {

		// if we add files below the baseDir, then, we add the directoring from the cmd.cwd -> baseDir\
		if (cmd.cwd.startsWith(laydown.resolvedBaseDir)) {
			f = path.join(cmd.cwd, f);
			f = path.relative(laydown.resolvedBaseDir, f);
		}
		// Otherwise, if the baseDir is outside of the cmd.cwd, then, the f path entered is what needs to be added
		// and should be relative to resolvedBaseDir

		let fileInfo = await laydown.getFileInfo(f);
		fileInfos[f] = fileInfo;
		if (fileInfo.absolutePaths.length === 0) {
			notFoundFiles.push(f);
		}
	}

	if (notFoundFiles.length > 0) {
		throw new Error("Following files could not be found, nothing added: " + notFoundFiles.join(","));
	}
	// --------- /Check that file exists --------- //

	// resolve the files as relative to 
	var files = cmd.files.map((f) => {
		f = path.join(cmd.cwd, f);
		let rel = path.relative(sourcePathInfo.dir, f);
		return rel;
	});

	// make sure we have the layers created
	if (!layersContent.layers) {
		layersContent.layers = {};
	}

	// get or create the layer
	var layer = layersContent.layers[cmd.layerName];
	if (!layer) {
		layer = {};
		layersContent.layers[cmd.layerName] = layer;
	}

	// get the files (or inialize if needed)
	if (layer.files == null) {
		layer.files = [];
	}
	// add the new files to the layer.files (could be optimized when needed)
	for (let f of files) {
		if (!layer.files.includes(f)) {
			layer.files.push(f);
		}
	}

	// sort
	layer.files.sort();

	// save
	await fs.writeJson(sourcePath, layersContent, { spaces: 2 });

	const relativeLayersJson = path.relative(cmd.cwd, sourcePath);

	// print the result heading
	print(`Layer '${cmd.layerName}' ${(laydown.exists) ? "updated" : "created"}:`, true, null, "cyan");
	var msg = [];
	msg.push(`  In    : '${cmd.origin.path}'`);
	msg.push("  Files :");
	for (let f of files) {
		let line = `    - ${f}`;
		const fileInfo = fileInfos[f];
		if (fileInfo.isGlob) {
			line += ` (${fileInfo.absolutePaths.length} files)`;
		}

		msg.push(line)
	}
	print(msg.join("\n"), true, null, "gray");

}