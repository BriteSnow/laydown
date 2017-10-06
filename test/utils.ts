import fs = require("fs-extra-plus");
import path = require("path");

const srcToCopy = "src/"
const testRootDir = "test/~out/";

export async function resetTestRoot(): Promise<any> {
	// some extra harcoded check before we delete
	if (!testRootDir.includes("test/~out")) {
		throw new Error("Test root dir does not look safe to delete: " + testRootDir);
	}
	await fs.remove(testRootDir);
}


/** Create a dedicated test output dir for a give test and copy files in './project-A/src`
 * that can be use for testing
 */
export async function setupTestDir(test: any): Promise<string> {
	var testDirSuffix = test.fullTitle().split(" ").join("/");
	var testDir = path.join(testRootDir, testDirSuffix);
	testDir = path.resolve(testDir);

	// Add some safety when deleting stuff
	if (!testDir.includes("test/~out")) {
		throw new Error("Test dir to be deleted do not look like a testDir " + testDir);
	}
	await fs.remove(testDir);
	await fs.mkdirs(testDir);

	const testSrcDir = path.join(testDir, "project-A/src/");
	await fs.copy(srcToCopy, testSrcDir);

	for (let f of await fs.listFiles(testSrcDir, ".ts")) {
		await fs.rename(f, f + ".txt");
	}

	return testDir;
}