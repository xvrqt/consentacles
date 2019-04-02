const fs = require('fs-extra');
const pkg = require(__dirname + '/../../package.json');
const rimraf = require('rimraf');
const stache = require('mustache');

const util = require(__dirname + '/../utility');
const CError = require(__dirname + '/../error');

/* Pretty Colors */
const chalk = require('chalk');
if(process.env.chalk === 'disabled') {
	chalk.enabled = false;
}

/* CLI input/output */
const inquirer = require('inquirer');

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
		template: 'blank',
		server: null,
		dockerize: null
	}
};

/* Project Route */
function project(template, name) {
	name = name ? name : defaults.project.name;
	template = template ? template : defaults.project.template;
	const error_header = `Failed to create new Consentacles project.`;

	/* Check to see if the directory already exists */
	if(fs.pathExistsSync(name)) {
		throw new CError(null, error_header, [`Directory '${name}' already exists.`], [], []);
	} else {
		try {
			fs.emptyDirSync(name);
		} catch(error) {
			throw new CError(error, error_header, [`Failed to create directory: ${name}`], [], [name]);
		}
	}

	/* Pre-create all the directories because in some environments, empty
	 * directories are not created on copy.
	*/
	const directories = [
		"dist",
		"src/components",
		"src/icons",
		"src/images",
		"src/meta",
		"src/pages",
		"src/scripts",
		"src/styles",
		"src/styles/fonts"
	];
	directories.forEach((dir, index) => {
		try { fs.emptyDirSync(`${name}/${dir}`); }
		catch(error) {
			throw new CError(error, error_header, [`Could not create ${name}/${dir}`], [], [name]);
		}
	});

	/* Copy the base files for an empty new project from source_files */
	let source_path;
	const template_path = `${__dirname}/source_files/template`;
	const templates = [
		`demo`,
		`blank`
	];
	switch (template) {
		case 'blank':
			source_path = `${template_path}/blank`;
			break;
		case 'demo':
			source_path = `${template_path}/demo`;
			break;
		default:
			const sublties = [
				`You can specify these templates for your project: ${templates.map((str) => { return str + "s";}).join(', ')}`, 
				`Example: $ consentacles new project <template> <name>`,
				`You can also skipe the template parameter. This defaults to a blank template`,
				`Example: $ consentacles new project <name>`
			];
			throw new CError(null, error_header, [`Could not find the ${template} template`], sublties, [name]);
	}
	try {
		fs.copySync(source_path, name, {});
	} catch(error) {
		throw new CError(error, error_header, [`Could not copy project files to a new project.`], [], [name]);
	}

	/* Run all the files through Mustaches to customize them a bit */
	const view_data = {
		name: name
	};
	const stache_files = [
		'index.html'
	];
	stache_files.forEach((file, index) => {
		const filename = `${name}/src/${file}`;
		let data;
		try {
			data = fs.readFileSync(filename, 'utf8');
		} catch(error) {
			throw new CError(error, error_header, [`Could read ${filename} in order to configure it.`], [], [name]);
		}

		const view = stache.render(data, view_data);

		try {
			fs.writeFileSync(filename, view);
		} catch(error) {
			throw new CError(error, error_header, [`Could write ${filename} in order to configure it.`], [], [name]);
		}
	});

	/* Prompt the user to fill out details */
	inquirer.prompt([
		{
			type: 'input',
			name: 'baseURL',
			message: `${chalk.dim("The base URL is used to generate the site map. You can add it later in package.json under the Consentacles object using the key 'baseURL'")}\n${chalk.magenta('Enter Base URL:')}`,
			default: `http://example.com`
		}
	]).then((answers) => {
		/* Update the package.json with the name and template */
		const project = util.parsePackage(name);
		project['consentacles']['name'] = name;
		project['consentacles']['template'] = template;
		project['consentacles']['baseURL'] = answers.baseURL;

		const filename = `${name}/package.json`;
		try {
			fs.writeJsonSync(filename, project, {spaces: 4});
		} catch(error) {
			throw new CError(error, error_header, [`Could not configure package.json`], [], [name]);
		}
	});
}

/* Page Route */
function page(name) {
	/* Check that we're in a Consentacles project, setup error handling */
	const error_header = `Failed to create a new page`;

	/* Determine the project's root */
	let project_root;
	try {
		project_root = util.getProjectRoot();
	} catch(cerror) {
		cerror.header = error_header;
		throw cerror;
	}

	/* Parse the project configuration */
	let project;
	try {
		project = util.parsePackage(`${project_root}/package.json`);
	} catch(cerror) {
		cerror.header = error_header;
		throw cerror;
	}

	/* Set up paths */
	const pages_path = `${project_root}/src/pages`;
	const new_page_path = `${pages_path}/${name}`;

	/* Parameter checking */
	if(name === undefined) {
		throw new CError(null, error_header, [`No page name provided.`], [`Usage: $ consentacles new page <name>`], []);
	}

	/* Check to see if the directory already exists, if not create it */
	if(fs.pathExistsSync(new_page_path)) {
		/* Do not delete! */
		throw new CError(null, error_header, [`Page already exists`], [], []);
	} else {
		try {
			fs.emptyDirSync(new_page_path);
		} catch(error) {
			throw new CError(null, error_header, [`Failed to create directory: ${new_page_path}`], [], []);
		}
	}

	/* Assemble the data object for Mustache templating */
	/* i.e. foo/bar/baz -> baz */
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
	file_types.forEach((ext, index) => {
		/* Read in the source template */
		const page_source = `${__dirname}/source_files/page/page.${ext}`;
		let file = null;
		try {
			file = fs.readFileSync(page_source, 'utf8');
		} catch(error) {
			throw new CError(error, error_header, [`Failed to read ${page_source}`], [], [new_page_path]);
		}

		/* Update the template with new data */
		const data = stache.render(file, view_data);

		/* Write to new page location */
		let filename = (ext === 'html') ? 'index' : prettyName;
		filename = `${new_page_path}/${filename}.${ext}`;
		try {
			fs.outputFileSync(filename, data);
		} catch(error) {
			throw new CError(error, error_header, [`Failed to create ${filename}`], [], [new_page_path]);
		}
	});
}

/* 'new' can create many things, this function hands off control to the correct
 * sub-module to make those things happen.
*/
function dispatch(type, template, name) {
	switch (type) {
		case 'project':
			if(name === undefined) { name = template; template = undefined; }
			project(template, name);
			break;
		case 'page':
			name = template;
			page(name);
			break;
		default:
			const error_header = 'Unrecognized option provided.';
			const sublties = [
				`You can use 'new' to create ${types.map((str) => { return str + "s";}).join(', ')}`, 
				`Example: $ consentacles new project <name>`
			];
			throw new CError(null, error_header, [], sublties);
	}
}

module.exports = {
    run: dispatch,
    types: types
};