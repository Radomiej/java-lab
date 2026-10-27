import {createTeaVMRunner} from './teavmRunner.js';
export async function runAssignment(assignment,files,{signal}={}){
  const runner=createTeaVMRunner();
  try{
    // Hidden test harness: generated assignments ship a JavaTest main that checks
    // behavior; for game tasks teavmRunner wraps everything into the lab package.
    const request=assignment.params?.javaTest
      ?{files:{...files,'JavaTest.java':assignment.params.javaTest},mainClass:'JavaTest',mode:'console'}
      :{files,mainClass:'Main',mode:'console'};
    const result=await runner.run(request,{signal,timeout:45000});
    if(!result.ok)throw Error(result.error||result.diagnostics?.map(d=>d.message).join('\n')||'Program nie uruchomił się.');
    return {output:result.output||''};
  }finally{runner.dispose();}
}
