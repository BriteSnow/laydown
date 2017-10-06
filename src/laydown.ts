
import { Partial } from "./utils";
import fs = require("fs-extra-plus");
import path = require("path");
import globby = require('globby');
import { asArray } from './utils';

export const laydownJsonFileName = "laydown.json";

export interface FileInfo {
	/** the file path as written in the .json file */
	path: string;
	/** absolute paths of all matching file (will be one if path is not glob, might be more if match) */
	absolutePaths: string[];
	/** tell if it is a glob file (useful when match is one) */
	isGlob: boolean;

}

/** Parsed replacer returned by `laydown.replacers: {[name:string]: Replacer}` */
interface Replacer {
	name: string;
	type: "path" | "content";
	rgx: RegExp[];
	only?: string[];
}

function parseReplacers(replacersData: any) {
	const replacers: { [name: string]: Replacer } = {};

	for (const name in replacersData) {
		const replacerData = replacersData[name];
		const replacerObj: any = {};
		replacerObj.name = name;
		replacerObj.type = replacerData.type;
		replacerObj.rgx = asArray(replacerData.rgx).map((rgxStr: string): RegExp => {
			return new RegExp(rgxStr, 'g');
		});
		if (replacerData.only) {
			replacerObj.only = asArray(replacerData.only);
		}
		replacers[name] = replacerObj;
	}

	return replacers;
}


/**
 * Represent a laydown file
 */
export class Laydown {
	readonly from: Origin; // Note: this name will probably change

	private readonly _data: LaydownData;

	readonly exists: boolean;

	get data(): LaydownData {
		return this._data; // TODO: need to decide if we clone or not. 
	}

	get name(): string | undefined {
		return this._data.name;
	}

	// get origin(): Origin {
	// 	return parseOrigin(this._data.origin || "./");
	// }

	/** return the laydown json file */
	get file(): string {
		return this.from.file!; // TODO: we know it exists at this point, might want to clean this up.
	}


	private _replacers: { [name: string]: Replacer } | null = null;
	get replacers(): { [name: string]: Replacer } | null {
		if (this._replacers === null && this._data.replacers) {
			this._replacers = parseReplacers(this._data.replacers);
		}
		return this._replacers;
	}

	private _resolvedBaseDir: string | null = null;
	/** Return the resolved absolute path of the baseDir */
	get resolvedBaseDir(): string {
		if (this._resolvedBaseDir == null) {
			let baseDir = this._data.baseDir || "./";
			if (baseDir.startsWith('.')) {
				this._resolvedBaseDir = path.resolve(path.dirname(this.file), baseDir);
			} else {
				this._resolvedBaseDir = path.resolve(baseDir);
			}
		}
		return this._resolvedBaseDir;
	}

	/** Layers name */
	get layerNames(): string[] {
		if (!this._data.layers) {
			return [];
		}

		return Object.keys(this._data.layers);
	}

	constructor(from: Origin, data: LaydownData, exists = true) {
		this._data = data;
		this.from = from;
		this.exists = exists;
	}

	hasLayer(layerName: string) {
		let _d = this._data;
		return (_d && _d.layers && _d.layers[layerName]);
	}

	/** Return file names for a given layer */
	getFiles(layerName: string): string[] {
		let _d = this._data;
		// Note: here we need to add the "!" as the compiler does not seem to infer it should be defined
		return (_d && _d.layers && _d.layers[layerName] && _d.layers[layerName].files) ? _d.layers[layerName].files! : [];
	}

	async getFileInfos(layerName: string): Promise<FileInfo[]> {
		const dir = this.resolvedBaseDir;

		const fileInfos: FileInfo[] = [];
		for (let f of this.getFiles(layerName)) {
			fileInfos.push(await this._getFileInfo(f, dir))
		}
		return fileInfos;
	}

	async getFileInfo(filePath: string): Promise<FileInfo> {
		return this._getFileInfo(filePath, this.resolvedBaseDir);
	}

	private async _getFileInfo(filePath: string, baseDir: string): Promise<FileInfo> {
		var info: any = {
			path: filePath,
			isGlob: (filePath.includes('*'))
		}
		const absoluteFilePath = path.join(baseDir, filePath);

		if (info.isGlob) {
			info.absolutePaths = await globby(absoluteFilePath)
		} else {
			const exists = await fs.pathExists(absoluteFilePath);
			info.absolutePaths = (exists) ? [absoluteFilePath] : []
		}

		return info;
	}

	toString() {
		let msg = ["laydown " + this.from.path];

		// print the name
		if (this.name) {
			msg.push("name: " + this.name);
		}

		if (this.data.baseDir) {
			msg.push("baseDir: " + this.data.baseDir);
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

// load or create a new laydown file (if it do not exist, it is not save the file, but create what is needed to save it)
export async function loadLaydown(cwd: string, origin: Origin, createIfNeeded = false): Promise<Laydown> {
	let jsonOriginPath = path.resolve(cwd, origin.path);
	jsonOriginPath = jsonOriginPath.endsWith(".json") ? jsonOriginPath : jsonOriginPath + "/" + laydownJsonFileName;
	jsonOriginPath = path.resolve(jsonOriginPath);

	const exists = await fs.pathExists(jsonOriginPath);

	origin = { ...origin, ...{ file: jsonOriginPath } };

	let data;
	if (exists) {
		data = await fs.readJson(jsonOriginPath);
		return new Laydown(origin, data);
	} else {
		if (!createIfNeeded) {
			throw new Error(`Cannot load laydown file at '${jsonOriginPath}', not found`);
		}
		data = {}
		return new Laydown(origin, data);
	}
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
	file?: string;
}
// --------- /Origin --------- //


interface LaydownData {
	baseDir?: string;
	name?: string;
	origin?: string;
	layers?: {
		[name: string]: {
			files?: string[]
		}
	}
	replacers?: {
		[name: string]: {
			type: string,
			rgx: string | string[];
			only?: string | string[];
		}
	}
}