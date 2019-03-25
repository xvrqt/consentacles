/* Builds a Consentacles project */

const pkg = require('../../package.json');

function build() {
	/* Check if we're in a consentacles project */
	if(!pkg.hasOwnKey('consentacles')) {
		process.exit(1);
	}

	/* Run the Gulpfile to move everything to source */
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
				// project(name);
				break;
			default:
				printError('Unrecognized option provided.');
				// printSubtle(`You can use 'new' to create ${types.map((str) => { return str + "s";}).join(', ')}`);
				printSubtle(`Example: $ consentacles new project foo`);
				process.exit(1);					
		}
	}
}

module.exports = {
    run: dispatch
};