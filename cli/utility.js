/* Functions common to all the CLI commands to keep things DRY */
const fs   = require('fs-extra');
const findUp = require('find-up');

const log = require(__dirname + '/logging');
const CError = require(__dirname + '/error');

/* Parses a Constentacles package.json file and returns it as a JS Object */
function parsePackage(filepath) {
	if(!filepath) {
		filepath = process.cwd();
	}
	/* Search along the path to / until we find a package.json if no path is 
	 * provided.
	*/
	filepath = findUp.sync('package.json', {cwd: filepath});
	if(!filepath) {
		throw new CError(error, null, [`Working directory does not appear to belong to a Consentacles project.`, `Could not find 'package.json' along path to root.`]);
	}

	/* Read the package.json file */
	let file;
	try {
		file = fs.readFileSync(filepath, 'utf8');
	} catch(error) {
		throw new CError(error, null, [`Could not read package.json.`,`Full Path: ${filepath}`]);
	}

	/* Convert to JS Object */
	let project;
	try {
		project = JSON.parse(file);
	} catch(error) {
		throw new CError(error, null, [`Could not parse package.json.`,`Full Path: ${filepath}`]);
	}

	/* Check that the project appears to be a Consentacles project */
	if(!project.hasOwnProperty('consentacles')) {
		throw new CError(null, null, [`package.json does not appear to belong to a Consentacles project.`,`Full Path: ${filepath}`]);
	} else {
		return project;
	}
}

/* This should be deprecated */
/* Checks if we are in a Consentacles project directory. If we are, returns
 * the package.json as a JS object and the path to the project's root. If we 
 * aren't it will print the appropriate error and exit the process.
*/
function inConsentaclesProject() {
	/* Find the first package.json along the path to / */
	const package_path = findUp.sync('package.json');
	let project_root = null;
	if(package_path) {
		project_root = package_path.substring(0, package_path.lastIndexOf('/'));
	} else {
		throw new CError(null, null, [`Working directory does not appear to belong to a Consentacles project.`,`Working directory does not appear to belong to a Consentacles project.`]);
	}

	const project = parsePackage();
	return {
		project: project,
		project_root: project_root
	};
}

function getProjectRoot(filepath) {
	if(!filepath) {
		filepath = process.cwd();
	}
	/* Search along the path to / until we find a package.json if no path is 
	 * provided.
	*/
	filepath = findUp.sync('package.json', {cwd: filepath});
	if(!filepath) {
		throw new CError(null, null, [`Working directory does not appear to belong to a Consentacles project.`, `Could not find 'package.json' along path to root.`]);
	} else {
		return filepath.substring(0, filepath.lastIndexOf('/'));
	}
}

/* Creates a function that prints an error, a list of reasons, cleans up and 
 * exits the process. This error header and directory to clean up are specified
 * at file creation time, the error explanations need to be provided as an array
 * of strings when the returned function is called.
*/
function cleanUpAndExit(error_header, dir_to_delete) {
	return (error_explanations, sublties) => {
		log.error(error_header);
		
		if(error_explanations) {
			error_explanations.forEach((explanation) => {
				log.list(explanation);
			});
		}

		if(sublties) {
			sublties.forEach((sublty) => {
				log.subtle(sublty);
			});
		}
		if(dir_to_delete) {
			fs.removeSync(dir_to_delete);
		}
		process.exit(1);
	};
}

module.exports = {
	parsePackage: parsePackage,
	inConsentaclesProject: inConsentaclesProject,
	cleanUpAndExit: cleanUpAndExit,
	getProjectRoot: getProjectRoot
};
