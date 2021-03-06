/* This test requires that the binary by linked, or it will fail all tests.
 * Link the binary by running: 'npm link' or by downloading the package from
 * NPM.
*/

/* NPM Package JSON */
const pkg = require(__dirname + '/../package.json');
/* Linked binary command */
const cmd = Object.getOwnPropertyNames(pkg.bin)[0];

/* Commands */
const help = require(__dirname + '/help.js');
const secret = require(__dirname +'/secret.js');

/* We're testing a binary so we need to run child processes */
const { spawn } = require('child_process');
const owd = process.cwd();

beforeAll(() => {
	process.chdir(__dirname);
});

afterAll(() => {
	process.chdir(owd);
});

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
		const child = spawn('consentacles', ['help']);
		let help_text = "";
		child.stdout.on('data', (chunk) => {
			help_text += chunk.toString();
		});
		child.on('exit', (code, signal) => {
			expect(code).toBe(0);
			expect(help_text.trim()).toMatch(help.text.trim());
			done();
 		});
	});

});

describe("Version Command", () => {
	/* Test EMPTY invocation */
	test('Prints the version number to stdout', (done) => {
		const child = spawn(cmd, ['version']);
		let version = "";
		child.stdout.on('data', (chunk) => {
			version += chunk.toString();
		});
		child.on('exit', (code, signal) => {
			expect(code).toBe(0);
			expect(version.trim()).toMatch(pkg.version.trim());
			done();
 		});
	});
});

describe("Secret Command", () => {
	/* Test EMPTY invocation */
	test('Prints the secret to stdout', (done) => {
		const child = spawn(cmd, ['secret']);
		let secret_text = "";
		child.stdout.on('data', (chunk) => {
			secret_text += chunk.toString();
		});
		child.on('exit', (code, signal) => {
			expect(code).toBe(0);
			expect(secret_text.trim()).toBe(secret.text.trim());
			done();
		});
	});
});
