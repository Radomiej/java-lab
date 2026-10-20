import {createTeaVMRunner} from './teavmRunner.js';
export async function runAssignment(assignment,files,{signal}={}){
  const runner=createTeaVMRunner();
  try{const result=await runner.run({files,mainClass:'Main',mode:'console'},{signal,timeout:15000});
    if(!result.ok)throw Error(result.error||result.diagnostics?.map(d=>d.message).join('\n')||'Program nie uruchomił się.');
    return {output:result.output||''};
  }finally{runner.dispose();}
}
