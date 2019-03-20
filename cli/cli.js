#!/usr/bin/env node

/* Parsers the commands and dispatches them to the appropriate module 
 */

const fs = require('fs');
const pkg = require('../package.json');

/* Pretty Colors */
const chalk = require('chalk');
if(process.env.chalk === 'disabled') {
	chalk.enabled = false;
}

/************
 * COMMANDS *
 ************/
const help = require('./help.js');

/* CONSTANTS */
const commands = [
	"new",
	"help",
	"test",
	"build",
	"serve",
	"secret"
];

/*******************
* HELPER FUNCTIONS *
********************/

/* Prints the title of the package */
function printTitle(str) {
	const pkg_name = pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1);
	const name = str ? str : pkg_name;
	console.log(chalk.magenta.bold(name));
}

/* Prints error messages in a standard way */
function printError(error) {
	console.log(chalk.bgRed.bold('Error:') + ' ' + chalk.red(error));
}

/* Prints dim text. Useful for additional info */
function printSubtle(text) {
	console.log(chalk.dim(text));
}

/* Returns a file as a string */
function fileToStr(filename) {
	fs.readFileSync(filename, 'utf8', (error, data) => {
		if(error) {
			console.log(`Error: ${error}`);
			process.exit(1);
		} else {
			return data;
		}
	});
}

/* Grab the args */
const [,, ...args] = process.argv;

/* Check to make sure that an argument was passed */
if(args.length === 0) {
	printError('No command provided.');
	printSubtle(`Available commands: ${commands.slice(0,-1).join(', ')}`);
	process.exit(1);
}

const command = args[0];
switch(command) {
	case 'help': 	// Print the help text and exit
		help.run();
		break;
	default:
		printError('Unknown command provided.');
		printSubtle(`Available commands: ${commands.slice(0,-1).join(', ')}`);
		process.exit(1);
}
