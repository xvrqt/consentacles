const fs = require('fs');
const ncp = require('ncp').ncp;
const pkg = require(__dirname + '/../../package.json');
const rimraf = require('rimraf');
const findUp = require('find-up');
const stache = require('mustache');

/* Pretty Colors */
const log = require(__dirname + '/../logging');
/* CLI input/output */
// const inquirer = require('inquirer');

/*******************
* HELPER FUNCTIONS *
********************/

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

/* Checks if we are in a Consentacles project directory. If we are, returns
 * the package.json as a JS object and the path to the project's root. If we 
 * aren't it will print the appropriate error and exit the process.
*/
function inConsentaclesProject(error_header) {
	/* Find the first package.json along the path to / */
	const package_path = findUp.sync('package.json');
	let project_root = null;
	if(package_path) {
		project_root = package_path.substring(0, package_path.lastIndexOf('/'));
	} else {
		log.printError(error_header);
		log.printErrorReason(`Working directory does not appear to belong to a Consentacles project.`);
		log.printErrorReason(`Could not find a 'package.json' along path to root.`)
		process.exit(1);
	}

	/* Read the package.json file */
	let file;
	try {
		file = fs.readFileSync(package_path, 'utf8');
	} catch(error) {
		log.printError(error_header);
		log.printErrorReason(`Could not read package.json.`);
		log.printErrorReason(`Full Path: ${package_path}`);
		process.exit(1);
	}

	/* Convert to JS Object */
	let package;
	try {
		package = JSON.parse(file);
	} catch(error) {
		log.printError(error_header);
		log.printErrorReason(`Could not parse package.json.`);
		log.printErrorReason(`Full Path: ${package_path}`);
		process.exit(1);
	}

	/* Check that the project appears to be a Consentacles project */
	if(!package.hasOwnProperty('consentacles')) {
		log.printError(error_header);
		log.printErrorReason(`package.json does not appear to belong to a Consentacles project.`);
		log.printErrorReason(`Full Path: ${package_path}`);
		process.exit(1);
	} else {
		return {
			project: project,
			project_root: project_root
		};
	}
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
	source_path = `${__dirname}/source_files/project`;
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

/* Page Route */
async function page(name) {
	/* Parameter checking */
	const error_header = `Failed to create a new page`;
	if(name === undefined) {
		log.printError(error_header);
		log.printErrorReason(`No page name provided.`);
		log.printSubtle(`Usage: $ consentacles new page <name>`);
		process.exit(1);
	}

	/* Check that we're in a Consentacles project. */
	const {project, project_root} = inConsentaclesProject(error_header);
	const pages_path = `${project_root}/src/pages`;
	const new_page_path = `${pages_path}/${name}`;

	/* Check to see if the directory already exists and create it */
	await new Promise((resolve, reject) => {
		fs.access(new_page_path, (error) => {
			if(error && error.code === 'ENOENT') {
				/* Create the directory */
				fs.mkdir(new_page_path, {recursive: true}, (error) => {
					if(error) {
						log.printError(error_header);
						log.printErrorReason(`Failed to create directory: ${new_page_path}`);
						process.exit(1);
					} else { resolve(); }
				});
			} else {
				log.printError(error_header);
				log.printErrorReason(`Page '${name}' already exists.`);
				process.exit(1);	
			}
		});
	});

	/* i.e. foo/bar -> bar */
	const prettyName = name.split('\\').pop().split('/').pop();

	/* Path the the root level styles directory. Used in path.scss */
	const styles_level = 2 + name.split('/').length - 1 + name.split('\\').length - 1;
	let styles_path = "";
	for(let i = 0; i < styles_level; i++) {
		styles_path += "../";
	}
	styles_path += "styles";

	/* Mustache Object */
	const view_data = {
		name: prettyName,
		styles_path: styles_path
	};

	/* Copy & Customize each constituent page file */
	const file_types = ["html", "scss", "ts"];
	const files_updated = []; // Array of promises
	file_types.forEach((ext, index) => {
		const page_source = `${__dirname}/source_files/page/page.${ext}`;
		files_updated.push(new Promise((resolve, reject) => {
			fs.readFile(page_source, 'utf8', (error, file) => {
				if(error) { reject(); }
				else {
					/* Customize */
					file = stache.render(file, view_data);
					/* Write */
					const out_path = (ext === 'html') ? `${new_page_path}/index.html` : `${new_page_path}/${prettyName}.${ext}`;
					fs.writeFile(out_path, file, (error) => {
						if(error) { reject(); }
						else { resolve(); }
					});
				}
			});
		}));
	});
	await Promise.all(files_updated).catch(() => {
		log.printError(error_header);
		log.printErrorReason(`Failed to create the new page files.`);
		process.exit(1);
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
		case 'page':
			page(name);
			break;
		default:
			log.printError('Unrecognized option provided.');
			log.printSubtle(`You can use 'new' to create ${types.map((str) => { return str + "s";}).join(', ')}`);
			log.printSubtle(`Example: $ consentacles new project <name>`);
			process.exit(1);					
	}
}

module.exports = {
    run: dispatch,
    types: types
};