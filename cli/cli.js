#!/usr/bin/env node

/* Parsers the commands and dispatches them to the appropriate module 
 */

const fs = require('fs');
const pkg = require('../package.json');

const log = require(__dirname + '/logging');

/************
 * COMMANDS *
 ************/
const new_cmd = require('./new/new.js');
const help = require('./help.js');
const build = require('./build/build.js');
const serve = require('./serve/serve.js');
const secret = require('./secret');

/* CONSTANTS */
const commands = [
	"new",
	"help",
	"test",
	"build",
	"serve",
	"secret"
];

/*******************
* HELPER FUNCTIONS *
********************/

/* Returns a file as a string */
function fileToStr(filename) {
	fs.readFileSync(filename, 'utf8', (error, data) => {
		if(error) {
			console.log(`Error: ${error}`);
			process.exit(1);
		} else {
			return data;
		}
	});
}

/* Grab the args */
const [,, ...args] = process.argv;

/* Check to make sure that an argument was passed */
if(args.length === 0) {
	log.printError('No command provided.');
	log.printSubtle(`Available commands: ${commands.slice(0,-1).join(', ')}`);
	process.exit(1);
}

const command = args[0];
switch(command) {
	case 'new':
		new_cmd.run(...args.slice(1));
		break;
	case 'help':
		help.run();
		break;
	case 'build':
		build.run(...args.slice(1));
		break;
	case 'serve':
		serve.run(...args.slice(1));
		break;
	case 'version':
		const version = pkg.version;
		log.print(`くコ:彡 ${version}`);
		break;
	case 'secret':
		secret.run();
		break;
	default:
		log.printError('Unknown command provided.');
		log.printSubtle(`Available commands: ${commands.slice(0,-1).join(', ')}`);
		process.exit(1);
}
