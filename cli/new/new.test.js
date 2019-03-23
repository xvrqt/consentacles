/* This test requires that the binary by linked, or it will fail all tests.
 * Link the binary by running: 'npm link' or by downloading the package from
 * NPM.
*/

const fs = require('fs');
const pkg = require('../../package.json');
const rimraf = require('rimraf');
/* Linked binary command */
const cmd = Object.getOwnPropertyNames(pkg.bin)[0];

/* We're testing a binary so we need to run child processes */
const { spawn } = require('child_process');

const workspace = `${__dirname}/test`;

/* Make clean the testing workspace */
beforeAll(async () => {
	await new Promise((resolve, reject) => {
		rimraf(workspace, (error) => {
			if(error) { reject(); }
			else {
				fs.mkdir(workspace, {recursive: true}, (error) => {
					if(error) { reject(); }
					else { resolve(); }
				});
			}
		});
	});
});

/* Clean up the directory structure */
afterAll(async () => {
	await new Promise((resolve, reject) => {
		rimraf(workspace, (error) => {
			if(error) { reject(error); }
			else { resolve(); }
		});
	});
});

beforeEach(() => {
	return process.chdir(workspace);
});

/* Helper Functions */

/* Wraps fs.access in a promise to make it easier to handle */
function fileExists(name) {
	return new Promise((resolve, reject) => {
		fs.access(name, (error) => {
			if(error) { reject(error); }
			else { resolve();}
		});
	});
}

describe("Exits with an error if unknown type is provided.", () => {
	
	test('Exits with error if no type is provided', (done) => {
		const child = spawn(cmd, ['new']);
		child.on('exit', (code, signal) => {
			expect(code).toBe(1);
			done();
		});
	});

	test('Exits with error if unknown type is provided', (done) => {
		const child = spawn(cmd, ['new', 'foo']);
		child.on('exit', (code, signal) => {
			expect(code).toBe(1);
			done();
 		});
	});
});

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

describe("Project Testing", () => {

	test('Creates a project with the default name, if no name provided', (done) => {
		const child = spawn(cmd, ['new', 'project']);
		child.on('exit', async (code, signal) => {
			expect(code).toBe(0);
			fs.access('tentacle', (error) => {
				expect(error).toBeNull();
				done();
			});
		});
	});

	test('Will not create a project if the directory with the same name already exists', (done) => {
		const child = spawn(cmd, ['new', 'project']);
		child.on('exit', (code, signal) => {
			expect(code).toBe(1);
			done();
		});
	});

	describe("Creates a project with the a name 'foo'", () => {

		test('Creates the project', (done) => {
			const child = spawn(cmd, ['new', 'project', 'foo']);
			child.on('exit', (code, signal) => {
				expect(code).toBe(0);
				done();
			});
		});

		test('Directories have been created correctly', () => {
			directory_exists = [];
			project.directories.forEach((value) => {
				directory_exists.push(fileExists(`${workspace}/foo/${value}`));
			});
			return Promise.all(directory_exists);
		});

		describe("Created the expected files", () => {
			
			test('Base files have been created', () => {
				file_exists = [];
				project.files.forEach((value) => {
					file_exists.push(fileExists(`${workspace}/foo/${value}`));
				});
				return Promise.all(file_exists);
			});
		});
	});
});

