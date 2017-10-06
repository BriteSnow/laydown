"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra-plus");
const path = require("path");
const globby = require("globby");
const utils_1 = require("./utils");
exports.laydownJsonFileName = "laydown.json";
function parseReplacers(replacersData) {
    const replacers = {};
    for (const name in replacersData) {
        const replacerData = replacersData[name];
        const replacerObj = {};
        replacerObj.name = name;
        replacerObj.type = replacerData.type;
        replacerObj.rgx = utils_1.asArray(replacerData.rgx).map((rgxStr) => {
            return new RegExp(rgxStr, 'g');
        });
        if (replacerData.only) {
            replacerObj.only = utils_1.asArray(replacerData.only);
        }
        replacers[name] = replacerObj;
    }
    return replacers;
}
/**
 * Represent a laydown file
 */
class Laydown {
    constructor(from, data, exists = true) {
        this._replacers = null;
        this._resolvedBaseDir = null;
        this._data = data;
        this.from = from;
        this.exists = exists;
    }
    get data() {
        return this._data; // TODO: need to decide if we clone or not. 
    }
    get name() {
        return this._data.name;
    }
    // get origin(): Origin {
    // 	return parseOrigin(this._data.origin || "./");
    // }
    /** return the laydown json file */
    get file() {
        return this.from.file; // TODO: we know it exists at this point, might want to clean this up.
    }
    get replacers() {
        if (this._replacers === null && this._data.replacers) {
            this._replacers = parseReplacers(this._data.replacers);
        }
        return this._replacers;
    }
    /** Return the resolved absolute path of the baseDir */
    get resolvedBaseDir() {
        if (this._resolvedBaseDir == null) {
            let baseDir = this._data.baseDir || "./";
            if (baseDir.startsWith('.')) {
                this._resolvedBaseDir = path.resolve(path.dirname(this.file), baseDir);
            }
            else {
                this._resolvedBaseDir = path.resolve(baseDir);
            }
        }
        return this._resolvedBaseDir;
    }
    /** Layers name */
    get layerNames() {
        if (!this._data.layers) {
            return [];
        }
        return Object.keys(this._data.layers);
    }
    hasLayer(layerName) {
        let _d = this._data;
        return (_d && _d.layers && _d.layers[layerName]);
    }
    /** Return file names for a given layer */
    getFiles(layerName) {
        let _d = this._data;
        // Note: here we need to add the "!" as the compiler does not seem to infer it should be defined
        return (_d && _d.layers && _d.layers[layerName] && _d.layers[layerName].files) ? _d.layers[layerName].files : [];
    }
    async getFileInfos(layerName) {
        const dir = this.resolvedBaseDir;
        const fileInfos = [];
        for (let f of this.getFiles(layerName)) {
            fileInfos.push(await this._getFileInfo(f, dir));
        }
        return fileInfos;
    }
    async getFileInfo(filePath) {
        return this._getFileInfo(filePath, this.resolvedBaseDir);
    }
    async _getFileInfo(filePath, baseDir) {
        var info = {
            path: filePath,
            isGlob: (filePath.includes('*'))
        };
        const absoluteFilePath = path.join(baseDir, filePath);
        if (info.isGlob) {
            info.absolutePaths = await globby(absoluteFilePath);
        }
        else {
            const exists = await fs.pathExists(absoluteFilePath);
            info.absolutePaths = (exists) ? [absoluteFilePath] : [];
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
                msg.push("  - " + name);
                let files = this.getFiles(name);
                if (files) {
                    msg.push("      Files:");
                    files.forEach((f) => {
                        msg.push("        - " + f);
                    });
                }
            });
        }
        return msg.join("\n  ");
    }
}
exports.Laydown = Laydown;
// load or create a new laydown file (if it do not exist, it is not save the file, but create what is needed to save it)
async function loadLaydown(cwd, origin, createIfNeeded = false) {
    let jsonOriginPath = path.resolve(cwd, origin.path);
    jsonOriginPath = jsonOriginPath.endsWith(".json") ? jsonOriginPath : jsonOriginPath + "/" + exports.laydownJsonFileName;
    jsonOriginPath = path.resolve(jsonOriginPath);
    const exists = await fs.pathExists(jsonOriginPath);
    origin = Object.assign({}, origin, { file: jsonOriginPath });
    let data;
    if (exists) {
        data = await fs.readJson(jsonOriginPath);
        return new Laydown(origin, data);
    }
    else {
        if (!createIfNeeded) {
            throw new Error(`Cannot load laydown file at '${jsonOriginPath}', not found`);
        }
        data = {};
        return new Laydown(origin, data);
    }
}
exports.loadLaydown = loadLaydown;
// --------- Origin --------- //
function parseOrigin(source) {
    var o = {
        type: "fs",
        source: source
    };
    // if source is a dir, we add the default laydown.json
    if (!source.endsWith(".json")) {
        o.pathDir = o.source;
        o.path = path.join(o.source, '/' + exports.laydownJsonFileName);
    }
    else {
        o.pathDir = path.parse(o.source).dir;
        o.path = o.source;
    }
    return o;
}
exports.parseOrigin = parseOrigin;
