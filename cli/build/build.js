/* Builds a Consentacles project */
const fs   = require('fs');
const pkg  = require('../../package.json');
const gulp = require('gulp');
		     require('./gulpfile.js');
const findUp = require('find-up');

/* Pretty Colors */
const chalk = require('chalk');
if(process.env.chalk === 'disabled') {
	chalk.enabled = false;
}

/* Helper Functions */

/* Prints error messages in a standard way */
function printError(error) {
	console.log(chalk.bgRed.bold('Error:') + ' ' + chalk.red(error));
}

function printErrorReason(reason) {
	console.log(chalk.yellowBright(' - ') + chalk.white(reason));
}

/* Prints dim text. Useful for additional info */
function printSubtle(text) {
	console.log(chalk.dim(text));
}

function buildAll() {
	const package_path = findUp.sync('package.json');

	/* Check if we're in a consentacles project */
	let file;
	try {
		file = fs.readFileSync(package_path, 'utf8');
	} catch(error) {
		printError(`Failed to build`);
		printErrorReason(`Could not find package.json.`);
		process.exit(1);
	}

	let package;
	try {
		package = JSON.parse(file);
	} catch(error) {
		printError(`Failed to build`);
		printErrorReason(`Could not parse package.json.`);
		process.exit(1);
	}

	if(!package.hasOwnProperty('consentacles')) {
		printError(`Failed to build.`);
		printErrorReason(`Working directory does not appear to belong to a ${chalk.magenta('Consentacles')} project.`);
		process.exit(1);
	}
	const user_settings = package.consentacles;

	/* Change the working directory to the project's root */
	process.chdir(package_path.substring(0, package_path.lastIndexOf('/')));

	/* Run the Gulpfile to move everything to source */
	gulp.task('default')();
}

/* 'build' command can build the entire project (default) or it can build parts
 * of the project, and web components, individually. This is the dispatch.
*/
function dispatch(type, name) {
	/* If unspecified, build all */
	if(name === undefined) {
		buildAll();
	} else {
		switch (type) {
			case 'component':
				console.log('Not yet implemented');
				break;
			default:
				printError('Unrecognized option provided.');
				// printSubtle(`You can use 'new' to create ${types.map((str) => { return str + "s";}).join(', ')}`);
				printSubtle(`Example: $ consentacles new project foo`);
				process.exit(1);					
		}
	}
}

module.exports = {
    run: dispatch
};