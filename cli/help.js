/* Responsible for the 'help' command. Contains only the help text and a
 * trivial function to print it.
*/

/* Pretty Colors */
const chalk = require('chalk');

const help_text = `${chalk.magenta('################\n# Consentacles #\n################')}

Usage:
    ${chalk.dim('$ consentacles <command> (option)')}

Commands:
    - new
    - help        ${chalk.dim('prints this text')}
    - build
    - serve
    - version     ${chalk.dim('prints the version number')}
`;

module.exports = {
    run: () => {
        console.log(help_text);
    },
    text: help_text
};