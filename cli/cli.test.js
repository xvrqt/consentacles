/* This test requires that the binary by linked, or it will fail all tests.
 * Link the binary by running: 'npm link' or by downloading the package from
 * NPM.
*/

/* NPM Package JSON */
const pkg = require('../package.json');
/* Linked binary command */
const cmd = Object.getOwnPropertyNames(pkg.bin)[0];

/* Commands */
const help = require('./help.js');

/* We're testing a binary so we need to run child processes */
const { spawn } = require('child_process');

describe("Exits with an error if unknown command is provided", () => {
	/* Test EMPTY invocation */
	test('Exits with error if no command is present', (done) => {
		const child = spawn(cmd);
		child.on('exit', (code, signal) => {
			expect(code).toBe(1);
			done();
		});
	});

	/* Test UNKNOWN invocation */
	test('Exits with error if unknown command is present', (done) => {
		const child = spawn(cmd, ['unknown']);
		child.on('exit', (code, signal) => {
			expect(code).toBe(1);
			done();
		});
	});
});

describe("HELP Command", () => {
	/* Test EMPTY invocation */
	test('Prints the help text to stdout', (done) => {
		const child = spawn(cmd, ['help']);
		let help_text = "";
		child.stdout.on('data', (chunk) => {
			help_text += chunk.toString();
		});
		child.on('exit', (code, signal) => {
			expect(code).toBe(0);
			expect(help_text.trim()).toBe(help.text.trim());
			done();
		});
	});

});

/* Test HELP command */
// test('HELP:')
