/* Functions common to all the CLI commands to keep things DRY */
const fs   = require('fs');
const findUp = require('find-up');

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
	let project;
	try {
		project = JSON.parse(file);
	} catch(error) {
		log.printError(error_header);
		log.printErrorReason(`Could not parse package.json.`);
		log.printErrorReason(`Full Path: ${package_path}`);
		process.exit(1);
	}

	/* Check that the project appears to be a Consentacles project */
	if(!project.hasOwnProperty('consentacles')) {
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

module.exports = {
	inConsentaclesProject: inConsentaclesProject
};
