/* Thrown or returned when something goes wrong. Allows the thrower to include 
 * any information about the error and a way to pretty print it to console in
 * a standaed way. Also provides some convenience functions.
*/
const fs   = require('fs-extra');
const log = require(__dirname + '/logging');

class ConsentacleError {

	constructor(original_error, header, reasons, sublties, dirs_to_delete) {
		this.original_error = original_error ? original_error : null;
		this.header = header ? header : null;
		this.reasons = reasons ? reasons : [];
		this.sublties = sublties ? sublties : [];
		this.dirs_to_delete = dirs_to_delete ? dirs_to_delete : [];
	}

	print(header, reasons, sublties) {
		header = header ? header : this.header;
		reasons = reasons ? reasons : this.reasons;
		sublties = sublties ? sublties : this.sublties;

		if(header) {
			log.error(header);
		}
		
		if(reasons) {
			reasons.forEach((explanation) => {
				log.list(explanation);
			});
		}

		if(sublties) {
			sublties.forEach((sublty) => {
				log.subtle(sublty);
			});
		}

		if(this.error) {
			log.additionalError(error);
		}
	}

	cleanUpAndExit() {
		if(this.dirs_to_delete) {
			this.dirs_to_delete.forEach((dir) => {
				fs.removeSync(dir);
			});
		}
		process.exit(1);
	}

	pce() {
		this.print();
		this.cleanUpAndExit();
	}
}

module.exports = ConsentacleError;
