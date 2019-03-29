/* Builds a Consentacles project */
const fs   = require('fs');
const pkg  = require('../../package.json');
const gulp = require('gulp');
		     require('./gulpfile.js');

/* Local packages */
const log = require(__dirname + '/../logging');
const util = require(__dirname + '/../utility');

function buildAll() {
	const error_header = `Failed to build.`;
	const {project, project_root} = util.inConsentaclesProject(error_header);
	const user_settings = project.consentacles;

	/* Change the working directory to the project's root */
	process.chdir(project_root);

	/* Run the Gulpfile to move everything to source */
	gulp.task('default')();
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
				log.error('Unrecognized option provided.');
				// log.printSubtle(`You can use 'new' to create ${types.map((str) => { return str + "s";}).join(', ')}`);
				log.subtle(`Example: $ consentacles new project foo`);
				process.exit(1);					
		}
	}
}

module.exports = {
    run: dispatch
};