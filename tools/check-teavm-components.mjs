// Actual TeaVM regression for lesson 402; preserves the user's saved project.
import {readFileSync} from 'node:fs';
import {load} from '../public/vendor/teavm/cdn/compiler.wasm-runtime.js';
import {prepareGameRequest} from '../src/services/gameWorkspace.js';
import {prepareJavaSources} from '../public/vendor/teavm/source-path.js';
import {buildCourseProject} from '../src/data/labGameV2Course.js';
import {courseJavaTest} from '../src/data/labGameV2Checks.js';
const bytes=name=>new Int8Array(readFileSync(new URL('../public/vendor/teavm/cdn/'+name,import.meta.url)));
const module=await load(bytes('compiler.wasm'));
const compiler=module.exports.createCompiler();
compiler.setSdk(bytes('compile-classlib-teavm.bin'));compiler.setTeaVMClasslib(bytes('runtime-classlib-teavm.bin'));
for(const solved of [false,true]) {
  const project=buildCourseProject('java','components','guided',{starter:!solved});
  const files={...project.files,'JavaTest.java':courseJavaTest('components','guided')};
  if(!solved)files['Counter.java']=files['Counter.java'].replace('counts++;','/* unfinished exercise */');
  const request=prepareGameRequest({files,mainClass:'JavaTest'});
  compiler.clearSourceFiles();compiler.clearOutputFiles();
  for(const [name,text] of prepareJavaSources(request.files))compiler.addSourceFile(name,text);
  if(!compiler.compile()||!compiler.generateWebAssembly({outputName:'app',mainClass:request.mainClass}))throw new Error('Compilation failed');
  const app=await load(compiler.getWebAssemblyOutputFile('app.wasm'));
  const output=[],originalLog=console.log;let failure;
  console.log=(...args)=>output.push(args.join(' '));
  try{await app.exports.main([]);}catch(error){failure=error;}finally{console.log=originalLog;}
  if(solved) {if(failure||!output.includes('PASS'))throw new Error('Solved lesson 402 failed: '+output.join('\n'));}
  else if(!failure||!output.some(line=>line==='LAB_CHECK_FAILED:Player → Counter.counts: oczekiwano 6, otrzymano 0'))throw new Error('Starter must report its actual count: '+output.join('\n'));
  console.log(solved?'PASS: solved lesson 402 in actual TeaVM':'PASS: unfinished lesson 402 reports count 0 vs expected 6');
}
