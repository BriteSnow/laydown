
import { Partial } from "./utils";
import fs = require("fs-extra-plus");
import path = require("path");

export const laydownJsonFileName = "laydown.json";

/**
 * Represent a laydown file
 */
export class Laydown {
	readonly from: Origin; // Note: this name will probably change

	readonly _data: LaydownData;

	get name(): string | undefined {
		return this._data.name;
	}

	get origin(): Origin {
		return parseOrigin(this._data.origin || "./");
	}

	get layerNames(): string[] {
		if (!this._data.layers) {
			return [];
		}

		return Object.keys(this._data.layers);
	}

	constructor(from: Origin, data: LaydownData) {
		this._data = data;
		this.from = from;
	}

	hasLayer(layerName: string) {
		let _d = this._data;
		return (_d && _d.layers && _d.layers[layerName]);
	}

	getFiles(layerName: string): string[] {
		let _d = this._data;
		// Note: here we need to add the "!" as the compiler does not seem to infer it should be defined
		return (_d && _d.layers && _d.layers[layerName] && _d.layers[layerName].files) ? _d.layers[layerName].files! : [];
	}

	toString() {
		let msg = ["laydown " + this.from.path];

		// print the name
		if (this.name) {
			msg.push("name: " + this.name);
		}

		// print the name
		var layerNames = this.layerNames;
		if (layerNames) {
			msg.push("layers:");
			layerNames.forEach((name) => {
				msg.push("  - " + name)
				let files = this.getFiles(name);
				if (files) {
					msg.push("      Files:")
					files.forEach((f) => {
						msg.push("        - " + f);
					})
				}
			});
		}

		return msg.join("\n  ");


	}
}

export async function loadLaydown(cwd: string, origin: Origin): Promise<Laydown> {
	let jsonOriginPath = path.resolve(cwd, origin.path);
	jsonOriginPath = jsonOriginPath.endsWith(".json") ? jsonOriginPath : jsonOriginPath + "/" + laydownJsonFileName;
	jsonOriginPath = path.resolve(jsonOriginPath);


	if (!(await fs.pathExists(jsonOriginPath))) {
		throw new Error("Error - laydown json file not found " + path);
	}
	const data = await fs.readJson(jsonOriginPath);

	return new Laydown(origin, data);
}


// --------- Origin --------- //
export function parseOrigin(source: string): Origin {
	var o: any = {
		type: "fs",
		source: source
	};

	// if source is a dir, we add the default laydown.json
	if (!source.endsWith(".json")) {
		o.pathDir = o.source;
		o.path = path.join(o.source, '/' + laydownJsonFileName);
	}
	// if source is a path to the json file, we take the pathDir
	else {
		o.pathDir = path.parse(o.source).dir;
		o.path = o.source;
	}

	return o;
}

export type OriginType = "fs" | "git" | "http";

export interface Origin {
	type: string;
	source: string;
	path: string;
	pathDir: string;
}
// --------- /Origin --------- //

interface LaydownData {
	name?: string;
	origin?: string;
	layers?: {
		[name: string]: {
			files?: string[]
		}
	}
}