/* This test requires that the binary by linked, or it will fail all tests.
 * Link the binary by running: 'npm link' or by downloading the package from
 * NPM.
*/

const fs = require('fs');
const pkg = require('../../package.json');
const rimraf = require('rimraf');
/* Linked binary command */
const cmd = Object.getOwnPropertyNames(pkg.bin)[0];

/* Module we're testing */
const new_cmd = require('./new.js');

/* We're testing a binary so we need to run child processes */
const { spawn } = require('child_process');

const workspace = `${__dirname}/test`;

/* Make clean the testing workspace */
beforeAll(() => {
	return new Promise((resolve, reject) => {
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

beforeEach(() => {
	return process.chdir(workspace);
});

/* Helper Functions */
// function errorHandler()
describe("Exits with an error if unknown type is provided.", () => {
	test('Exits with error if no type is provided', async () => {
		const child = spawn(cmd, ['new']);
		await child.on('exit', (code, signal) => {
			expect(code).toBe(1);
		});
	});

	test('Exits with error if unknown type is provided', async () => {
		const child = spawn(cmd, ['new', 'foo']);
		await child.on('exit', (code, signal) => {
			expect(code).toBe(1);
 		});
	});
});

describe("Project Testing", () => {
	test('Creates a project with the default name, if no name provided', async () => {
		const child = spawn(cmd, ['new', 'project']);
		await child.on('exit', (code, signal) => {
			expect(code).toBe(0);
			return new Promise((resolve, reject) => {
				fs.access('tentacle', (error) => {
					expect(error).toBeNull();
					resolve();
				});
			});
		});
	});
});

