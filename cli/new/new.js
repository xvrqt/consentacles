const fs = require('fs');
const pkg = require('../../package.json');

/* Pretty Colors */
const chalk = require('chalk');
if(process.env.chalk === 'disabled') {
	chalk.enabled = false;
}

/* CLI input/output */
// const inquirer = require('inquirer');

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

/* Wraps mkdir in a promise to make it easier to handle */
function mkdir(name, recursive) {
	return new Promise((resolve, reject) => {
		recursive = recursive ? recursive : false;
		fs.mkdir(name, {recursive: recursive}, (error) => {
			if(error) {
				printError(error);
				reject();
			} else { resolve(); }
		})
	})
}

/* CONSTANTS */
const types = [
	"component",
	"project",
	"route",
	"page"
];

/* Default Settings for each route */
const defaults = {
	project: {
		name: "tentacle",
		server: null,
		dockerize: null
	}
};

const project_directories = [
	"dist",
	"src/components",
	"src/icons",
	"src/images",
	"src/meta",
	"src/pages",
	"src/scripts",
	"src/styles"
];

/* Project Route */
async function project(name) {
	directory_created = [mkdir(name)];
	project_directories.forEach((value) => {
		directory_created.push(mkdir(`${name}/${value}`, true));
	});
	await Promise.all(directory_created);
	console.log('done');
}

/* 'new' can create many things, this function hands off control to the correct
 * sub-module to make those things happen.
*/
function dispatch(type, name) {
	switch (type) {
		case 'project':
			project(name);
			break;
		default:
			printError('Unrecognized option provided.');
			printSubtle(`You can use 'new' to create ${types.map((str) => { return str + "s";}).join(', ')}`);
			printSubtle(`Example: $ consentacles new project foo`);
			process.exit(1);					
	}
}

module.exports = {
    run: dispatch,
    types: types
};