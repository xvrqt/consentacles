/* This test requires that the binary by linked, or it will fail all tests.
 * Link the binary by running: 'npm link' or by downloading the package from
 * NPM.
*/

const fs = require('fs-extra');
const pkg = require(__dirname + '/../../package.json');

/* Linked binary command for Consentacles */
const cmd = Object.getOwnPropertyNames(pkg.bin)[0];

/* We're testing a binary so we need to run child processes */
const { spawn } = require('child_process');
const workspace = `${__dirname}/test`;
const owd = process.cwd();

/* Make clean the testing workspace */
beforeAll((done) => {
	/* Create an empty testing directory */
	fs.emptyDirSync(workspace);
	/* Create a new consentacles projext */
	process.chdir(workspace);
	const child = spawn(cmd, ['new', 'project', 'foo']);
	child.on('exit', async (code, signal) => {
		if(code != 0) {
			console.error("Could not create a new Consentacles project named 'foo' to test the build command. Abandoning build testing.");
		}
		done();
	});
});

/* Clean up the directory structure */
afterAll(() => {
	process.chdir(owd);
	fs.removeSync(workspace);
});

beforeEach(() => {
	process.chdir(workspace);
});

// describe("Exits with an error if unknown type is provided.", () => {
	
// 	test('Exits with error if no type is provided', (done) => {
// 		const child = spawn(cmd, ['new']);
// 		child.on('exit', (code, signal) => {
// 			expect(code).toBe(1);
// 			done();
// 		});
// 	});

// 	test('Exits with error if unknown type is provided', (done) => {
// 		const child = spawn(cmd, ['new', 'foo']);
// 		child.on('exit', (code, signal) => {
// 			expect(code).toBe(1);
// 			done();
//  		});
// 	});
// });

/* New project structure */
const project = {
	directories: [
		"dist",
		"src/components",
		"src/icons",
		"src/images",
		"src/meta",
		"src/pages",
		"src/scripts",
		"src/styles"
	],
	files: [
		"src/icons/source.png"
	]
};

const build_timeout = 60000;
describe("Build Testing", () => {

	test('Fails to build when not inside a Consentacles project', (done) => {
		const child = spawn(cmd, ['build']);
		child.on('exit', async (code, signal) => {
			expect(code).toBe(1);
			done();
		});
	}, build_timeout);

	test('Builds when in a Consentacles project', (done) => {
		process.chdir('foo');
		const child = spawn(cmd, ['build']);
		child.on('exit', async (code, signal) => {
			expect(code).toBe(0);
			done();
		});
	}, build_timeout);

	test('Builds when in a sub-directory of a Consentacles project', (done) => {
		process.chdir('foo/src/images');
		const child = spawn(cmd, ['build']);
		child.on('exit', async (code, signal) => {
			expect(code).toBe(0);
			done();
		});
	}, build_timeout);
});
