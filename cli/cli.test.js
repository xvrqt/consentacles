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
const secret = require('./secret.js');

/* We're testing a binary so we need to run child processes */
const { spawn } = require('child_process');

describe("Exits with an error if unknown command is provided", () => {
	/* Test EMPTY invocation */
	test('Exits with error if no command is present', async () => {
		const child = spawn(cmd);
		await child.on('exit', (code, signal) => {
			expect(code).toBe(1);
		});
	});

	/* Test UNKNOWN invocation */
	test('Exits with error if unknown command is present', async () => {
		const child = spawn(cmd, ['unknown']);
		await child.on('exit', (code, signal) => {
			expect(code).toBe(1);
 		});
	});
});

describe("HELP Command", () => {
	/* Test EMPTY invocation */
	test('Prints the help text to stdout', async () => {
		const child = spawn(cmd, ['help']);
		let help_text = "";
		child.stdout.on('data', (chunk) => {
			help_text += chunk.toString();
		});
		await child.on('exit', (code, signal) => {
			expect(code).toBe(0);
			expect(help_text.trim()).toBe(help.text.trim());
 		});
	});

});

describe("Version Command", () => {
	/* Test EMPTY invocation */
	test('Prints the version number to stdout', async () => {
		const child = spawn(cmd, ['version']);
		let version = "";
		child.stdout.on('data', (chunk) => {
			version += chunk.toString();
		});
		await child.on('exit', (code, signal) => {
			expect(code).toBe(0);
			expect(version.trim()).toBe(pkg.version.trim());
 		});
	});
});

describe("Secret Command", () => {
	/* Test EMPTY invocation */
	test('Prints the secret to stdout', async () => {
		const child = spawn(cmd, ['secret']);
		let secret_text = "";
		child.stdout.on('data', (chunk) => {
			secret_text += chunk.toString();
		});
		await child.on('exit', (code, signal) => {
			expect(code).toBe(0);
			expect(secret_text.trim()).toBe(secret.text.trim());
		});
	});
});
