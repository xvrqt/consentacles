const fs = require('fs');
const ncp = require('ncp').ncp;
const pkg = require(__dirname + '/../../package.json');
const rimraf = require('rimraf');

/* Pretty Colors */
const log = require(__dirname + '/../logging');

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

/* Wraps fs.copyFile in a promize to make it more tractable */
function copyFile(source, destination) {
	return new Promise((resolve, reject) => {
		fs.copyFile(source, destination, (error) => {
			if(error) { reject(error); }
			else { resolve(); }
		});
	});
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

/* Project Route */
async function project(name) {
	name = name ? name : defaults.project.name;

	/* Check to see if the directory already exists */
	await new Promise((resolve, reject) => {
		fs.access(name, (error) => {
			if(error && error.code === 'ENOENT') {
				resolve();
			} else {
				log.printError(`Failed to create new Consentacles project.`);
				log.printErrorReason(`Directory '${name}' already exists.`);
				process.exit(1);	
			}
		});
	});

	/* Copy the base files for an empty new project from source_files */
	source_path = `${__dirname}/source_files`;
	await new Promise((resolve) => {
		ncp(source_path, name, {stopOnErr: true}, async (error) => {
			if(error) {
				log.printError(`Failed to create new Consentacles project.`);
				log.printErrorReason(error);

				/* Clean up */
				await new Promise((resolve, reject) => {
					rimraf(workspace, (error) => {
						if(error) { reject(error); }
						else { resolve(); }
					});
				});

				process.exit(1);
			} else { resolve(); }
		});
	});
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
			log.printError('Unrecognized option provided.');
			log.printSubtle(`You can use 'new' to create ${types.map((str) => { return str + "s";}).join(', ')}`);
			log.printSubtle(`Example: $ consentacles new project foo`);
			process.exit(1);					
	}
}

module.exports = {
    run: dispatch,
    types: types
};