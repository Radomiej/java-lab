import fs from 'node:fs';import {fileURLToPath} from 'node:url';
import {load} from '../public/vendor/teavm/cdn/compiler.wasm-runtime.js';
import {gameEngineRuntimeFiles} from '../src/data/gameEngineRuntime.js';
import {prepareJavaSources} from '../public/vendor/teavm/source-path.js';
const root=new URL('../',import.meta.url);
const read=file=>fs.readFileSync(new URL(file,root));
const module=await load(new Int8Array(read('public/vendor/teavm/cdn/compiler.wasm')));
const compiler=module.exports.createCompiler();compiler.setSdk(new Int8Array(read('public/vendor/teavm/cdn/compile-classlib-teavm.bin')));compiler.setTeaVMClasslib(new Int8Array(read('public/vendor/teavm/cdn/runtime-classlib-teavm.bin')));
const examples=JSON.parse(read('docs/java-course-examples.json'));
const files={...gameEngineRuntimeFiles};
for(const [index,example] of examples.entries()){
 let name,source;
 if(example.kind.startsWith('class')){name=/public class (\w+)/.exec(example.code)[1];source=example.code;if(name==='GameMain'){source=source.replaceAll('GameMain','PdfGameMain'+index);name='PdfGameMain'+index;}}
 else{name='PdfExample'+index;source='import engine.*;\npublic class '+name+' extends Game {\n'+(example.kind==='update'?example.context:'')+'\n@Override public void '+(example.kind==='update'?'onUpdate(double delta)':'onCreate()')+' {\n'+(example.kind==='update'?'':example.context)+'\n'+example.code+'\n}\n}';}
 files[name+'.java']='package lab;\n'+source;
}
const diagnostics=[];compiler.onDiagnostic(d=>diagnostics.push({severity:d.severity,file:d.fileName,line:d.lineNumber,message:d.message}));
for(const [path,source]of prepareJavaSources(files))compiler.addSourceFile(path,source);
const ok=compiler.compile();
fs.writeFileSync(new URL('docs/java-course-code-check.json',root),JSON.stringify({ok,examples:examples.length,diagnostics},null,2));console.log(JSON.stringify({ok,examples:examples.length,diagnostics}));if(!ok)process.exitCode=1;
