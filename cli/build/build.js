/* Builds a Consentacles project */
const fs   = require('fs');
const pkg  = require('../../package.json');
const gulp = require('gulp');
		     require('./gulpfile.js');

/* Local packages */
const log = require(__dirname + '/../logging');
const util = require(__dirname + '/../utility');
const CError = require(__dirname + '/../error');

function buildAll() {
	const error_header = `Failed to build.`;
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
	const user_settings = project.consentacles;

	/* Change the working directory to the project's root */
	const owd = process.cwd();
	process.chdir(project_root);

	/* Run the Gulpfile to move everything to source */
	gulp.task('default')(() => {
		process.chdir(owd);
	});
}

/* 'build' command can build the entire project (default) or it can build parts
 * of the project, and web components, individually. This is the dispatch.
*/
function dispatch(type, name) {
	/* If unspecified, build all */
	if(name === undefined) {
		buildAll();
	} else {
		switch (type) {
			case 'component':
				console.log('Not yet implemented');
				break;
			default:
				const error_header = 'Unrecognized option provided.';
				throw new CError(null, error_header, [], []);
		}
	}
}

module.exports = {
    run: dispatch
};