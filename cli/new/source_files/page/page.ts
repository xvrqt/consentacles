/* This script is included by its sibling index.html - if you decide not to use
 * it, remove the corresponding <script> tag to prevent page errors.
 * 
 * Any script in this pages file will be transpiled during build so feel free
 * add additional page specific libraries and scripts. Scripts that are used by
 * more than one page are better places in the scripts/ directory.
*/

const text = `{{name}} has loaded!`;

function loaded(str: string): void {
	console.log(str);
}

loaded(text);

export {};
