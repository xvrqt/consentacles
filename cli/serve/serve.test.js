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
	// await new Promise((resolve, reject) => {
	// 	rimraf(workspace, (error) => {
	// 		if(error) { reject(); }
	// 		else {
	// 			fs.mkdir(workspace, {recursive: true}, (error) => {
	// 				if(error) { reject(); }
	// 				else { resolve(); }
	// 			});
	// 		}
	// 	});
	// });

	/* Create and build a new consentacles projext */
	// await new Promise ((resolve, reject) => {
	// 	process.chdir(workspace);
	// 	const child = spawn(cmd, ['new', 'project', 'foo']);
	// 	child.on('exit', async (code, signal) => {
	// 		process.chdir(workspace + '/foo');
	// 		const build = spawn(cmd, ['build']);
	// 		build.on('exit', async (code, signal) => {
	// 			if(code != 0) {
	// 				console.error("Could not create and build a new Consentacles project named 'foo' to test the serve command. Abandoning serve testing.");
	// 				reject();
	// 			} else { resolve(); }
	// 		});
	// 	});
	// });
});

/* Clean up the directory structure */
afterAll(async () => {
	// await new Promise((resolve, reject) => {
	// 	rimraf(workspace, (error) => {
	// 		if(error) { reject(error); }
	// 		else { resolve(); }
	// 	});
	// });
});

beforeEach(() => {
	// return process.chdir(workspace);
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

describe("Serve Testing", () => {

	// test('Trivial', (done) => {
	// 	// const child = spawn(cmd, ['build']);
	// 	// child.on('exit', async (code, signal) => {
	// 	// 	expect(code).toBe(1);
	// 	// 	done();
	// 	// });
	// 	expect(1).toBe(1);
	// 	done();
	// });
});

