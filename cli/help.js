/* Responsible for the 'help' command. Contains only the help text and a
 * trivial function to print it.
*/

/* Pretty Colors */
const chalk = require('chalk');

const help_text = `Consentacles
	
`;

module.exports = {
	run: () => {
		console.log(help_text);
	},
	text: help_text
};