/* Builds a Consentacles project */

const pkg = require('../../package.json');

function build() {
	/* Check if we're in a consentacles project */
	if(!pkg.hasOwnKey('consentacles')) {
		process.exit(1);
	}

	/* Run the Gulpfile to move everything to source */
}

module.exports = {
    run: build
};