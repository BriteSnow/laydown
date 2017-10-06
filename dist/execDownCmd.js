"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs-extra-plus");
const laydown_1 = require("./laydown");
const printer_1 = require("./printer");
const prompt_1 = require("./prompt");
const minimatch = require("minimatch");
/**
 *
 * TODO: Add support So far only support origin.type = "fs"
 */
async function execDownCmd(downCmd) {
    // Get the origin (so far assume "fs" origin type)
    var laydown = await laydown_1.loadLaydown(downCmd.cwd, downCmd.origin);
    let srcDir = path.resolve(downCmd.cwd, downCmd.origin.pathDir);
    let dstDir = path.resolve(downCmd.cwd, downCmd.distDir);
    const replacers = laydown.replacers;
    const replacersValues = {};
    // get the values for each replacers
    if (replacers) {
        for (const name in replacers) {
            replacersValues[name] = await prompt_1.prompt(`${name}: `);
        }
    }
    let copiedFiles = [];
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
            else {
                await fs.copy(srcFile, dstFile);
            }
            copiedFiles.push({ file: dstRelativePath, overwrite: exists });
        }
    }
    printer_1.print(`Layer '${downCmd.layerName}' downloaded:`, true, null, "cyan");
    var msg = [];
    msg.push(`  From  : '${downCmd.origin.path}'`);
    msg.push(`  To    : '${downCmd.distDir}`);
    msg.push("  Files :");
    for (let finfo of copiedFiles) {
        msg.push(`    - ${finfo.file} (${(finfo.overwrite) ? "udpated" : "added"})`);
    }
    printer_1.print(msg.join("\n"), true, null, "gray");
}
exports.execDownCmd = execDownCmd;
