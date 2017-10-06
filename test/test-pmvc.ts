import { lay } from "../src/lay";
import fs = require("fs-extra-plus");
import path = require("path");
import { setupTestDir, resetTestRoot } from "./utils";
import { loadLaydown, parseOrigin } from "../src/laydown";


describe('test-pmvc', function () {

	before(resetTestRoot);

	it('full-pmvc', async function () {
		this.timeout(50000);

		const testDir = await setupTestDir(this.test);

		const cwd = path.join(testDir, "pmvc");
		await fs.mkdirs(cwd);

		// create the laydown
		let argv = 'node dist/lay-bin init ./ /Users/jeremychone/_jeremy/_projects/projectmvc/projectmvc_mvnsrc'.split(' ');
		await lay(cwd, argv);

		// add the files
		argv = 'node dist/lay-bin add base pom.xml'.split(' ');
		await lay(cwd, argv);
		argv = 'node dist/lay-bin add java src/main/**/*.java src/**/*.xml pom.xml'.split(' ');
		await lay(cwd, argv);

		// describe it
		argv = 'node dist/lay-bin desc'.split(' ');
		await lay(cwd, argv);

		const laydownJsonFile = path.join(cwd, 'laydown.json');
		let laydownData = await fs.readJson(laydownJsonFile)

		laydownData.replacers = {
			"package_path": {
				"type": "path",
				"rgx": "org/projectmvc"
			},
			"package_name": {
				"type": "content",
				"rgx": "org\\.projectmvc",
				"only": [
					"**/*.java",
					"**/*.xml",
					"**/*.properties"
				]
			},
			"app_name": {
				"type": "content",
				"rgx": ["pmvc", "projectmvc"],
				"only": [
					"**/*.xml",
					"**/*.properties"
				]
			}
		};

		await fs.writeJson(laydownJsonFile, laydownData, { spaces: 2 });

		const origin = parseOrigin(laydownJsonFile);
		const laydown = await loadLaydown(path.dirname(laydownJsonFile), origin)
		// download it 
		// argv = 'node dist/lay-bin down . base'.split(' ');
		// await lay(cwd, argv);

		argv = 'node dist/lay-bin down . java'.split(' ');
		await lay(cwd, argv);


	});

});
