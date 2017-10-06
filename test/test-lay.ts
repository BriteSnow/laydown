import { lay } from "../src/lay";
import fs = require("fs-extra-plus");
import path = require("path");
import { setupTestDir, resetTestRoot } from "./utils";
import * as assert from './assert';


describe('test-lay-init', function () {

	before(resetTestRoot);

	it('init-blank', async function () {
		const testDir = await setupTestDir(this.test);
		const cwd = testDir;

		var result = await lay(cwd, "node dist/lay-bin init");

		// todo: do the asserts
		await assert.pathExists(cwd, 'laydown.json');
	});

	it('init-with-dir', async function () {
		const testDir = await setupTestDir(this.test);
		const cwd = path.join(testDir, '/sub-dir'); // does not exists, but fine for this test

		await lay(cwd, "node dist/lay-bin init ../");

		// checks
		await assert.pathExists(cwd, '../laydown.json');
	});

	it('init-with-basedir', async function () {
		const testDir = await setupTestDir(this.test);
		const cwd = testDir;

		await lay(cwd, "node dist/lay-bin init ./ /some/path/to/some/project");

		// checks
		await assert.pathExists(cwd, 'laydown.json');
		// TODO: needs to check if the .baseDir was set
	});

});


describe('test-lay-add', function () {

	before(resetTestRoot);

	it('add-simple', async function () {
		const testDir = await setupTestDir(this.test);
		let cwd: string;

		// init (create the laydown.json)
		cwd = testDir;
		await lay(cwd, "node dist/lay-bin init");

		// add some files from a sub directory
		cwd = path.join(testDir, "project-A/src");
		await lay(cwd, "node dist/lay-bin add layer-1 lay.ts.txt lay-bin.ts.txt");

		// checks
		await assert.pathExists(testDir, 'laydown.json');
		// TODO: check that the files has been added to layer-1
	});

	it('add-double', async function () {
		const testDir = await setupTestDir(this.test);
		let cwd: string;

		// init (create the laydown.json)
		cwd = testDir;
		await lay(cwd, "node dist/lay-bin init");


		cwd = path.join(testDir, "project-A/src/");
		await lay(cwd, "node dist/lay-bin add data lay.ts.txt lay-bin.ts.txt");
		await lay(cwd, "node dist/lay-bin add data utils.ts.txt");

		// checks
		await assert.pathExists(testDir, 'laydown.json');
	});
});

describe('test-lay-desc', function () {

	before(resetTestRoot);

	it('desc-simple', async function () {
		const testDir = await setupTestDir(this.test);
		let cwd: string;

		// init (create the laydown.json)
		cwd = testDir;
		await lay(cwd, "node dist/lay-bin init");

		// create the laydown file
		cwd = path.join(testDir, "project-A/src");
		await lay(cwd, "node dist/lay-bin add layer-1 lay.ts.txt lay-bin.ts.txt")

		// do a description
		await lay(path.dirname(cwd), "node dist/lay-bin desc");
	});

});


describe('test-lay-down', function () {

	before(resetTestRoot);

	it('down-simple', async function () {
		const testDir = await setupTestDir(this.test);
		let cwd: string;

		// Setup: First we defined a laydown source
		cwd = path.join(testDir, "/project-A");
		await lay(cwd, "node dist/lay-bin init");
		await lay(cwd, "node dist/lay-bin add layer-1 src/lay.ts.txt src/lay-bin.ts.txt");

		// lay down the layer-1 in project-B
		const destDir = path.join(testDir, "/project-B");
		await fs.mkdirs(destDir);
		await lay(destDir, "node dist/lay-bin down ../project-A layer-1");

		// checks
		await assert.pathExists(destDir, 'src/lay.ts.txt');
	});

	it('down-with-dist', async function () {
		const testDir = await setupTestDir(this.test);
		let cwd: string;

		// Setup: First we defined a laydown source
		cwd = path.join(testDir, "/project-A");
		await lay(cwd, "node dist/lay-bin init");
		await lay(cwd, "node dist/lay-bin add layer-1 src/lay.ts.txt src/lay-bin.ts.txt");

		// lay down the layer-1 in project-B
		const destDir = path.join(testDir, "/project-B");
		await fs.mkdirs(destDir);
		await lay(destDir, "node dist/lay-bin down ../project-A layer-1 ./demo/");

		// checks
		await assert.pathExists(destDir, 'demo/', 'src/lay.ts.txt');

	});

});