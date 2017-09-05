import path = require("path");
import fs = require("fs-extra-plus");
import { AddCmd, LayersContent } from "./cmd";
import { laydownJsonFileName } from "./laydown";
import { print } from "./printer";

export async function execAddCmd(addCmd: AddCmd) {

	// get the origin, add the default json file if no json file, and make sure it is full resolved
	let sourcePath = path.resolve(addCmd.cwd, addCmd.origin.path);
	sourcePath = path.resolve(sourcePath);

	let sourcePathInfo = path.parse(sourcePath);

	let notFoundFiles: string[] = [];

	// check if the files exist
	for (let f of addCmd.files) {
		let fPath = path.join(addCmd.cwd, f);
		if (!(await fs.pathExists(fPath))) {
			notFoundFiles.push(f)
		}
	}

	if (notFoundFiles.length > 0) {
		throw new Error("Following files could not be found, nothing added: " + notFoundFiles.join(","));
	}

	// resolve the files as relative to 
	var files = addCmd.files.map((f) => {
		f = path.join(addCmd.cwd, f);
		let rel = path.relative(sourcePathInfo.dir, f);
		return rel;
	});

	var layersContent: LayersContent;

	// Load or create new layersContent
	var exists = await fs.pathExists(sourcePath);
	if (exists) {
		layersContent = await fs.readJson(sourcePath) as LayersContent;
	} else {
		layersContent = {
			layers: {}
		}
	}

	// get or create the layer
	var layer = layersContent.layers[addCmd.layerName];
	if (!layer) {
		layer = {};
		layersContent.layers[addCmd.layerName] = layer;
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

	const relativeLayersJson = path.relative(addCmd.cwd, sourcePath);

	// print the result heading
	print(`Layer '${addCmd.layerName}' ${(exists) ? "updated" : "created"}:`, true, null, "cyan");
	var msg = [];
	msg.push(`  In    : '${addCmd.origin.path}'`);
	msg.push("  Files :");
	for (let f of files) {
		msg.push(`    - ${f}`)
	}
	print(msg.join("\n"), true, null, "gray");

}