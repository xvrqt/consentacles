#!/usr/bin/env node

/* Parsers the commands and dispatches them to the appropriate module 
 */

/* Import the package info */
const pkg = require('../package.json');

/* Pretty Colors */
const chalk = require('chalk');

/* CONSTANTS */
const commands = [
	"new",
	"help",
	"test",
	"build",
	"serve",
	"secret"
];
const command_str = commands.slice(0,-1).join(', ');

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

/* Grab the args */
const [,, ...args] = process.argv;

/* Check to make sure that an argument was passed */
if(args.length === 0) {
	printError('No command provided.');
	printSubtle(`Available commands: ${command_str}`);
	process.exit(1);
}

/************
 * COMMANDS *
 ************/




// console.log(`Hello Girls ${args}`);