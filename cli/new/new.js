const fs = require('fs');
const pkg = require('../../package.json');

/* Pretty Colors */
const chalk = require('chalk');
if(process.env.chalk === 'disabled') {
	chalk.enabled = false;
}

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

/* CONSTANTS */
const types = [
	"component",
	"project",
	"route",
	"page"
];

/* 'new' can create many things, this function hands off control to the correct
 * sub-module to make those things happen.
*/
function dispatch(type, name) {
	switch (type) {
		case 'project':
			console.log(type, name);
			break;
		default:
			printError('Unrecognized option provided.');
			printSubtle(`You can use 'new' to create: ${commands.join('s, ')}`);
			printSubtle(`Example: $ consentacles new project`);
			process.exit(1);					
	}
}

module.exports = {
    run: dispatch
};