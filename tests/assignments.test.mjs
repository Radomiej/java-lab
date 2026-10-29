import test from 'node:test';
import assert from 'node:assert/strict';
import {generateAssignment,publicAssignment} from '../shared/assignments/generator.js';
import {templates} from '../shared/assignments/catalog.js';
import {validateSubmission} from '../shared/assignments/contract.js';
import {createAssignmentHandlers} from '../server/assignments/handlers.js';
import {issueToken} from '../server/telemetry/token.js';

const request={generatorVersion:'1',templateId:'java-basics',seed:'KLASA-A',difficulty:'standard',index:0};
const uuid='11111111-1111-4111-8111-111111111111';
const env={TELEMETRY_TOKEN_SECRET:'x'.repeat(40),TELEMETRY_ALLOWED_ORIGINS:'https://lab.test'};
const ids={machineId:uuid,sessionId:uuid};
const headers={origin:'https://lab.test','content-type':'application/json',authorization:`Bearer ${issueToken(ids,env.TELEMETRY_TOKEN_SECRET,Date.now())}`};
const call=async(handler,body,customHeaders=headers)=>{let status,data;await handler({method:'POST',headers:customHeaders,body},{writeHead(code){status=code;},end(value){data=JSON.parse(value);}});return {status,data};};

test('same full descriptor recreates the complete assignment; other seeds change data',()=>{
  assert.deepEqual(generateAssignment(request),generateAssignment(request));
  assert.notDeepEqual(generateAssignment(request).params,generateAssignment({...request,seed:'KLASA-B'}).params);
  assert.notEqual(generateAssignment(request).id,generateAssignment({...request,difficulty:'easy'}).id);
  assert.throws(()=>generateAssignment({...request,generatorVersion:'2'}));
});
test('all families and levels have starters, references, unambiguous criteria and public payload without references',()=>{
  for(const template of templates)for(const difficulty of ['easy','standard','challenge'])for(let index=0;index<(template.kind==='course-task'?3:10);index++){
    const full=generateAssignment({...request,templateId:template.id,difficulty,index});
    assert.ok(full.prompt.length>30);assert.ok(full.criteria.length>=1);
    assert.ok(Object.keys(full.starterFiles).length);assert.ok(Object.keys(full.referenceFiles).length);
    const publicTask=publicAssignment(full);assert.equal('referenceFiles' in publicTask,false);
    assert.equal(JSON.stringify(publicTask).includes('referenceFiles'),false);
  }
});
test('submission validation rejects unsafe files, empty student IDs and mismatched app',()=>{
  const assignment=generateAssignment(request);
  const value={kind:'submission',version:1,eventId:uuid,submissionId:uuid,appId:'java-lab',...ids,studentId:' 3A-12 ',studentName:'Ola',sentAt:Date.now(),assignment,files:assignment.starterFiles};
  assert.equal(validateSubmission(value).studentId,'3A-12');
  for(const patch of [{studentId:''},{files:{'../secret':'x'}},{files:{'Main.java':123}},{appId:'www-lab'}])assert.throws(()=>validateSubmission({...value,...patch}));
});
test('API keeps references private and reconstructs references instead of trusting client input',async()=>{
  const published=[];const handlers=createAssignmentHandlers({env,appId:'java-lab',publish:async message=>published.push(message)});
  const generated=await call(handlers.generate,request);
  assert.equal(generated.status,200);assert.equal('referenceFiles' in generated.data.assignment,false);
  const response=await call(handlers.submit,{...ids,submissionId:uuid,eventId:uuid,studentId:'3A-12',studentName:'Ola',sentAt:123,assignment:{...request,referenceFiles:{'Main.java':'FAKE'}},files:{'Main.java':'student code'}});
  assert.equal(response.status,202);assert.equal(published.length,1);
  assert.deepEqual(JSON.parse(JSON.stringify(published[0].assignment)),generateAssignment(request));
  assert.equal(published[0].files['Main.java'],'student code');
  assert.equal((await call(handlers.submit,{...ids,assignment:request}, {...headers,authorization:''})).status,401);
  assert.equal((await call(handlers.generate,{...request,templateId:'sql-select'})).status,400);
  assert.equal((await call(handlers.generate,request,{...headers,origin:'https://evil.test'})).status,403);
});
test('variant families draw 10 distinct tasks per seed, independent of difficulty and reproducible',()=>{
  for(const templateId of ['java-basics','java-gamedev'])for(const seed of ['KLASA-A','KLASA-B','DLA-GRUPY-2']){
    const variants=new Set();
    for(let index=0;index<10;index++){
      const task=generateAssignment({templateId,seed,difficulty:'standard',index,generatorVersion:'1'});
      assert.ok(!variants.has(task.params.variant),`duplicate variant ${task.params.variant} in seed ${seed}`);variants.add(task.params.variant);
      // Permutation is set-scoped: the same index keeps its variant at every ramp level.
      const easy=generateAssignment({templateId,seed,difficulty:'easy',index,generatorVersion:'1'});
      assert.equal(easy.params.variant,task.params.variant);
      assert.notDeepEqual(easy.starterFiles,task.starterFiles);
      assert.ok(task.params.javaTest.length>100,'hidden Java harness is generated');
    }
    assert.equal(variants.size,10);
  }
  const topics=new Set();for(let index=0;index<10;index++)topics.add(generateAssignment({templateId:'java-basics',seed:'KLASA-A',difficulty:'standard',index,generatorVersion:'1'}).params.topic);
  assert.deepEqual([...topics].sort(),['01','02','03']);
});
test('broker failure is retryable and is not reported as accepted',async()=>{
  const handlers=createAssignmentHandlers({env,appId:'java-lab',publish:async()=>{throw Error('broker');}});
  const response=await call(handlers.submit,{...ids,submissionId:uuid,eventId:uuid,studentId:'A',studentName:'',sentAt:123,assignment:request,files:{'Main.java':'code'}});
  assert.equal(response.status,502);
});

test('all 56 lesson quizzes and 56 code tasks reach the submission publisher with server keys',async()=>{
  let published;
  const handlers=createAssignmentHandlers({env,publish:async message=>{published=message;}});
  for(const template of templates.filter(item=>item.kind))for(let index=0;index<(template.kind==='course-task'?3:1);index++){
    const assignment=generateAssignment({...request,templateId:template.id,index});
    const response=await call(handlers.submit,{submissionId:uuid,eventId:uuid,...ids,studentId:'QA-JAVA',studentName:'',sentAt:Date.now(),assignment:{...request,templateId:template.id,index},files:assignment.starterFiles});
    assert.equal(response.status,202,template.id);
    assert.deepEqual({...published.assignment.referenceFiles},assignment.referenceFiles);
    assert.equal(published.appId,'java-lab');
  }
});
