"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra-plus");
const path = require("path");
exports.laydownJsonFileName = "laydown.json";
/**
 * Represent a laydown file
 */
class Laydown {
    get name() {
        return this._data.name;
    }
    get origin() {
        return parseOrigin(this._data.origin || "./");
    }
    get layerNames() {
        if (!this._data.layers) {
            return [];
        }
        return Object.keys(this._data.layers);
    }
    constructor(from, data) {
        this._data = data;
        this.from = from;
    }
    hasLayer(layerName) {
        let _d = this._data;
        return (_d && _d.layers && _d.layers[layerName]);
    }
    getFiles(layerName) {
        let _d = this._data;
        // Note: here we need to add the "!" as the compiler does not seem to infer it should be defined
        return (_d && _d.layers && _d.layers[layerName] && _d.layers[layerName].files) ? _d.layers[layerName].files : [];
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
async function loadLaydown(cwd, origin) {
    let jsonOriginPath = path.resolve(cwd, origin.path);
    jsonOriginPath = jsonOriginPath.endsWith(".json") ? jsonOriginPath : jsonOriginPath + "/" + exports.laydownJsonFileName;
    jsonOriginPath = path.resolve(jsonOriginPath);
    if (!(await fs.pathExists(jsonOriginPath))) {
        throw new Error("Error - laydown json file not found " + path);
    }
    const data = await fs.readJson(jsonOriginPath);
    return new Laydown(origin, data);
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
