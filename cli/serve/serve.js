/* Builds a Consentacles project */
const fs   = require('fs');
const pkg  = require('../../package.json');


const ip = require('ip');
const shell = require('shelljs');
const express = require('express');

/* Pretty Colors */
const chalk = require('chalk');
if(process.env.chalk === 'disabled') {
	chalk.enabled = false;
}

/* Helper Functions */

/* Prints error messages in a standard way */
function printError(error) {
	console.log(chalk.bgRed.bold('Error:') + ' ' + chalk.red(error));
}

function printErrorReason(reason) {
	console.log(chalk.yellowBright(' - ') + chalk.white(reason));
}

/* Prints dim text. Useful for additional info */
function printSubtle(text) {
	console.log(chalk.dim(text));
}

function serve(address, port) {
	if(address === undefined) { address = 'localhost'; }
	else if(address === 'lan') { address = ip.address(); }

	if(port === undefined) { port = 8080; }

	/* Express app setup */
	const app = express();
	app.use(express.static('./dist'));

	/* Start the server */
	app.listen(port, address, () => console.log(`==========\nApp listening on port http://${address}:${port}\n==========`));
}

module.exports = {
    run: serve
};