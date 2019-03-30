const fs = require('fs-extra');
const pkg = require(__dirname + '/../../package.json');
const rimraf = require('rimraf');
const stache = require('mustache');

/* Pretty Colors */
const log = require(__dirname + '/../logging');
const util = require(__dirname + '/../utility');

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
	const error_header = `Failed to create new Consentacles project.`;
	
	/* Check to see if the directory already exists */
	await new Promise((resolve, reject) => {
		fs.access(name, (error) => {
			if(error && error.code === 'ENOENT') {
				resolve();
			} else {
				log.error(error_header);
				log.list(`Directory '${name}' already exists.`);
				process.exit(1);	
			}
		});
	});

	/* Pre-create all the directories because in some environments, empty
	 * directories are not created.
	*/
	const directories = [
		"dist",
		"src/components",
		"src/icons",
		"src/images",
		"src/meta",
		"src/pages",
		"src/scripts",
		"src/styles"
	];
	directories.forEach((dir, index) => {
		try { fs.emptyDirSync(`${name}/${dir}`); }
		catch(error) { 
			log.error(error_header);
			log.list(`Could not create ${name}/${dir}`);
			fs.removeSync(name);
			process.exit(1);
		}
	});

	/* Copy the base files for an empty new project from source_files */
	source_path = `${__dirname}/source_files/template/blank`;
	try {
		fs.copySync(source_path, name, {});
	} catch(error) {
		log.error(error_header);
		log.list(error.message);
		fs.removeSync(name);
		process.exit(1);
	}
	process.chdir(name);

	/* Run all the files through Mustaches to customize them a bit */
	const view_data = {
		name: name
	};
	const stache_files = [
		'index.html'
	];
	stache_files.forEach((file, index) => {
		const filename = `src/${file}`;
		let data = fs.readFileSync(filename, 'utf8');
		data = stache.render(data, view_data);
		fs.writeFileSync(filename, data);
	});

	/* Update the package.json with the name */
	const {project, project_root} = util.inConsentaclesProject(error_header);
	project['consentacles']['name'] = name;

	const out_file = `${project_root}/package.json`;
	const data = JSON.stringify(project, null, 4);
	await new Promise((resolve, reject) => {
		fs.writeFile(out_file, data, (error) => {
			if(error) { reject(); }
			else { resolve(); }
		});
	});
}

/* Page Route */
async function page(name) {
	/* Parameter checking */
	const error_header = `Failed to create a new page`;
	if(name === undefined) {
		log.error(error_header);
		log.list(`No page name provided.`);
		log.subtle(`Usage: $ consentacles new page <name>`);
		process.exit(1);
	}

	/* Check that we're in a Consentacles project. */
	const {project, project_root} = util.inConsentaclesProject(error_header);
	const pages_path = `${project_root}/src/pages`;
	const new_page_path = `${pages_path}/${name}`;

	/* Check to see if the directory already exists and create it */
	await new Promise((resolve, reject) => {
		fs.access(new_page_path, (error) => {
			if(error && error.code === 'ENOENT') {
				/* Create the directory */
				fs.mkdir(new_page_path, {recursive: true}, (error) => {
					if(error) {
						log.error(error_header);
						log.list(`Failed to create directory: ${new_page_path}`);
						process.exit(1);
					} else { resolve(); }
				});
			} else {
				log.error(error_header);
				log.list(`Page '${name}' already exists.`);
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
		log.error(error_header);
		log.list(`Failed to create the new page files.`);
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
			log.error('Unrecognized option provided.');
			log.subtle(`You can use 'new' to create ${types.map((str) => { return str + "s";}).join(', ')}`);
			log.subtle(`Example: $ consentacles new project <name>`);
			process.exit(1);					
	}
}

module.exports = {
    run: dispatch,
    types: types
};