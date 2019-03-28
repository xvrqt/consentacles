/* Builds a Consentacles project */
const fs   = require('fs');
const pkg  = require('../../package.json');


const ip = require('ip');
const shell = require('shelljs');
const express = require('express');

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