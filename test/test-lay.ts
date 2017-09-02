import {lay} from "../src/lay";
import fs = require("fs-extra");
import path = require("path");

describe('lay', function() {
	it('simple-add', async function() {
		const testDir = await setupTestDir(this.test);
		
		var pwd = path.join(testDir, "src");
		var argv = "node dist/lay-bin add ../ layer-1 index.js lay.js".split(" ");
		var result = await lay(pwd, argv);
				
	});

	it('add-and-again', async function() {
		const testDir = await setupTestDir(this.test);
		
		var pwd = path.join(testDir, "src");
		var argv = "node dist/lay-bin add ../ data index.js lay.js".split(" ");
		await lay(pwd, argv);
		argv = "node dist/lay-bin add ../ data utils.js".split(" ");
		await lay(pwd, argv);
	});
});

const srcToCopy = "dist/"
const testRootDir = "test/out/";

async function setupTestDir(test: any): Promise<string>{
	var testDirSuffix = test.fullTitle().split(" ").join("/");
	var testDir = path.join(testRootDir, testDirSuffix);
	testDir = path.resolve(testDir);

	// Add some safety when deleting stuff
	if (!testDir.includes("test/out")){
		throw new Error("Test dir to be deleted do not look like a testDir " + testDir);
	}
	await fs.remove(testDir);
	await fs.mkdirs(testDir);
  await fs.copy(srcToCopy, path.join(testDir, "src/"));

	return testDir;
}