/* Example file that can be imported into other TypeScript files, or pages but
 * is not particular to any web component or page.
 *
 * Libraries are a good example of what might go into the scripts/ directory.
*/

const text = `

          ,'""\`.         ▄████▄   ▒█████   ███▄    █   ██████ ▓█████  ███▄    █ ▄▄▄█████▓ ▄▄▄       ▄████▄   ██▓    ▓█████   ██████ 
         / _  _ \\       ▒██▀ ▀█  ▒██▒  ██▒ ██ ▀█   █ ▒██    ▒ ▓█   ▀  ██ ▀█   █ ▓  ██▒ ▓▒▒████▄    ▒██▀ ▀█  ▓██▒    ▓█   ▀ ▒██    ▒ 
         |(@)(@)|       ▒▓█    ▄ ▒██░  ██▒▓██  ▀█ ██▒░ ▓██▄   ▒███   ▓██  ▀█ ██▒▒ ▓██░ ▒░▒██  ▀█▄  ▒▓█    ▄ ▒██░    ▒███   ░ ▓██▄   
         )  __  (       ▒▓▓▄ ▄██▒▒██   ██░▓██▒  ▐▌██▒  ▒   ██▒▒▓█  ▄ ▓██▒  ▐▌██▒░ ▓██▓ ░ ░██▄▄▄▄██ ▒▓▓▄ ▄██▒▒██░    ▒▓█  ▄   ▒   ██▒
        /,'))((\`.\\     ▒ ▓███▀ ░░ ████▓▒░▒██░   ▓██░▒██████▒▒░▒████▒▒██░   ▓██░  ▒██▒ ░  ▓█   ▓██▒▒ ▓███▀ ░░██████▒░▒████▒▒██████▒▒
       (( ((  )) ))      ░ ░▒ ▒  ░░ ▒░▒░▒░ ░ ▒░   ▒ ▒ ▒ ▒▓▒ ▒ ░░░ ▒░ ░░ ▒░   ▒ ▒   ▒ ░░    ▒▒   ▓▒█░░ ░▒ ▒  ░░ ▒░▓  ░░░ ▒░ ░▒ ▒▓▒ ▒ ░
        \`\\ \`)(' /'      ░  ▒     ░ ▒ ▒░ ░ ░░   ░ ▒░░ ░▒  ░ ░ ░ ░  ░░ ░░   ░ ▒░    ░      ▒   ▒▒ ░  ░  ▒   ░ ░ ▒  ░ ░ ░  ░░ ░▒  ░ ░
                           ░        ░ ░ ░ ▒     ░   ░ ░ ░  ░  ░     ░      ░   ░ ░   ░        ░   ▒   ░          ░ ░      ░   ░  ░  ░  
                           ░ ░          ░ ░           ░       ░     ░  ░         ░                ░  ░░ ░          ░  ░   ░  ░      ░ 
`;

/* Imported by main.ts to test that files can be successfully imported and built. */
export function helloConsentacles(): void {
	console.log(text); 
}
