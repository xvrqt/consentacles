/* Example file that can be imported into other TypeScript files but is not
 * particular to any web component or page. Libraries are a good example of 
 * what might go into the scripts/ directory.
*/

/* Imported by main.ts to test that files can be successfully imported and built. */
export function helloTypeScript(greeter: string): string {
	return `Hello from example_import.ts {greeter}!`;
}
