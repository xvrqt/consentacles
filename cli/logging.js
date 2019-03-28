/* File to standardize how errors and info are presented to the user */
const fs = require('fs');
const pkg = require(__dirname + '/../package.json');
const pkg_name = pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1);

/* Pretty Colors */
const chalk = require('chalk');
if(process.env.chalk === 'disabled') {
	chalk.enabled = false;
}

/* Helper function searches for the packagae name an replaces it with a 
 * magenta version.
*/
function colorName(str) {
	return str.replace(pkg_name, chalk.magenta.bold(pkg_name));
}

/* Generic console log */
function print(text, purple) {
	purple ? console.log(chalk.magenta.bold(text)) : console.log(colorName(text));
}

/* Prints error messages in a standard way */
function printError(error) {
	error = colorName(error);
	console.log(chalk.bgRed.bold('Error:') + ' ' + chalk.red(error));
}

/* Print under an error to give a list of reasons for the failure */
function printErrorReason(reason) {
	reason = colorName(reason);
	console.log(chalk.yellowBright(' - ') + chalk.white(reason));
}

/* Prints dim text. Useful for additional info */
function printSubtle(text) {
	test = colorName(text);
	console.log(chalk.dim(text));
}

module.exports = {
	pkg_name: pkg_name,
	
	print: print,
	printError: printError,
	printErrorReason: printErrorReason,
	printSubtle: printSubtle
}