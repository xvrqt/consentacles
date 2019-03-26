/* Responsible for the 'help' command. Contains only the help text and a
 * trivial function to print it.
*/

/* Pretty Colors */
const chalk = require('chalk');
if(process.env.chalk === 'disabled') {
    chalk.enabled = false;
}

const help_text = `${chalk.magenta('################\n# Consentacles #\n################')}

Usage:
    ${chalk.dim('$ consentacles <command> (option)')}

Commands:
    - new         ${chalk.dim('create a new <type> with <name>')}
    - help        ${chalk.dim('prints this text')}
    - build
    - serve
    - version     ${chalk.dim('prints the version number')}

New:
    - project
        Usage: ${chalk.dim('$ consentacles new project foo')}
        ${chalk.dim('This will create a new consentacles project space in a directory name \'foo\'')}
`;

module.exports = {
    run: () => {
        console.log(help_text);
    },
    text: help_text
};