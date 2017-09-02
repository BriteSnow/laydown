import path = require("path");
import fs = require("fs-extra");
import {Cmd, AddCmd} from "./cmd_parse";

export async function exec(cmd: Cmd): Promise<any>{
	if (cmd instanceof AddCmd){
		await execAddCmd(cmd);
	}else{
		throw Error("command not supported " + cmd.constructor.name);
	}
}



async function execAddCmd(addCmd: AddCmd){
	console.log(`Going to execute`, addCmd)

	// get the source, add the default json file if no json file, and make sure it is full resolved
	let sourcePath = path.resolve(addCmd.cwd, addCmd.source);
	sourcePath = sourcePath.endsWith(".json")?sourcePath:sourcePath + "/laydown-layers.json";
	sourcePath = path.resolve(sourcePath);

	let sourceInfo = path.parse(sourcePath);
	
	// resolve the files as relative to 
	var files = addCmd.files.map((f) => {
		f = path.join(addCmd.cwd,f);
		let rel = path.relative(sourceInfo.dir, f);
		return rel;
	});

	var layersContent: LayersContent;

	// Load or create new layersContent
	var exists = await fs.pathExists(sourcePath);
	if (exists){
		layersContent = await fs.readJson(sourcePath) as LayersContent;
	}else{
		layersContent = {
			layers: {}
		}
	}

	// get or create the layer
	var layer = layersContent.layers[addCmd.layerName];
	if (!layer){
		layer = {};
		layersContent.layers[addCmd.layerName] = layer;
	}

	
	// get the files (or inialize if needed)
	if (layer.files == null){
		layer.files = [];
	}
	// add the new files to the layer.files (could be optimized when needed)
	for (let f of files){
		if (!layer.files.includes(f)){
			layer.files.push(f);
		}
	}

	// sort
	layer.files.sort();

	// save
	await fs.writeJson(sourcePath, layersContent, {spaces: 2});

}



interface LayersContent {
	layers: {
		[name: string]: {
			files?: string[];
		}
	}
}


