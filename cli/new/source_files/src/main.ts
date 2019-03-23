import { helloTypeScript } from 'scripts/example_import';

(() => {
  /* Test that the TypeScript in our scripts/ directory can be imported at 
   * transpile time
  */
  console.log(helloTypeScript("Girls"));
})();
