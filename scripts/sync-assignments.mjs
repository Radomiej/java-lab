import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const shared=['shared/assignments/catalog.js','shared/assignments/generator.js','shared/assignments/contract.js','server/assignments/handlers.js','src/services/assignmentOutbox.js','src/services/assignmentSubmissions.js','src/components/AssignmentRoot.jsx','src/components/AssignmentWorkspace.jsx','src/components/assignments.css','src/components/AssignmentWorkspace.test.jsx','tests/assignments.test.mjs','tests/assignment-client.test.mjs'];
const targets=[['web-learning-lab',shared],['databases',shared],['lab-admin',['shared/assignments/catalog.js','shared/assignments/contract.js']]];
let mismatches=0;
for(const [project,files] of targets)for(const file of files){
  const source=readFileSync(resolve(root,file)),target=resolve(root,'..',project,file);
  if(process.argv.includes('--check')){let actual;try{actual=readFileSync(target);}catch{}if(!actual?.equals(source)){console.error(`${project}/${file} differs`);mismatches++;}}
  else{mkdirSync(dirname(target),{recursive:true});writeFileSync(target,source);}
}
if(mismatches)process.exitCode=1;else console.log(process.argv.includes('--check')?'Assignment contracts and shared UI are synchronized.':'Assignment contracts and shared UI copied.');
