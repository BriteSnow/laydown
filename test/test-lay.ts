import { lay } from "../src/lay";
import fs = require("fs-extra-plus");
import path = require("path");
import { setupTestDir, resetTestRoot } from "./utils";


describe('test-lay-add', function () {

	before(resetTestRoot);

	it('simple-add', async function () {
		const testDir = await setupTestDir(this.test);

		var pwd = path.join(testDir, "project-A/src");
		var argv = "node dist/lay-bin add ../ layer-1 index.js.txt lay.js.txt".split(" ");
		var result = await lay(pwd, argv);

		// todo: do the asserts (console.log and files)
	});

	it('add-and-again', async function () {
		const testDir = await setupTestDir(this.test);

		var pwd = path.join(testDir, "project-A/src/");
		var argv = "node dist/lay-bin add ../ data index.js.txt lay.js.txt".split(" ");
		await lay(pwd, argv);
		argv = "node dist/lay-bin add ../ data utils.js.txt".split(" ");
		await lay(pwd, argv);
	});
});


describe('test-lay-down', function () {

	before(resetTestRoot);

	it('simple-down', async function () {
		const testDir = await setupTestDir(this.test);

		const sourceDir = path.join(testDir, "source-1");

		// Setup: First 
		// Define
		var pwd = path.join(sourceDir, "project-A/src/");
		var argv = "node dist/lay-bin add ../ layer-1 index.js.txt lay.js.txt".split(" ");
		var result = await lay(pwd, argv);

		// todo: add checks
	});

});