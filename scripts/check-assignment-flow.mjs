// Local end-to-end contract check: API -> publisher -> consumer -> independent SQLite archive.
// Does not touch the real RabbitMQ queue or the running admin database.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createAssignmentHandlers} from '../server/assignments/handlers.js';
import {issueToken} from '../server/telemetry/token.js';
import {templates} from '../shared/assignments/catalog.js';
import {openStore} from '../../lab-admin/server/store.js';
import {processMessage} from '../../lab-admin/server/consumer.js';

const env={TELEMETRY_TOKEN_SECRET:'local-contract-test-secret-'.repeat(2),TELEMETRY_ALLOWED_ORIGINS:'https://local.test'};
const ids={machineId:randomUUID(),sessionId:randomUUID()};
const headers={origin:'https://local.test','content-type':'application/json',authorization:`Bearer ${issueToken(ids,env.TELEMETRY_TOKEN_SECRET)}`};
async function call(handler,body){let status,data;await handler({method:'POST',headers,body},{writeHead(value){status=value;},end(value){data=JSON.parse(value);}});return {status,data};}
const store=openStore(':memory:');let count=0,acked=0;
try{
  for(const template of templates)for(const difficulty of ['easy','standard','challenge']){
    const messages=[],handlers=createAssignmentHandlers({env,appId:template.appId,publish:async value=>messages.push(value)});
    const assignment={generatorVersion:'1',templateId:template.id,seed:'E2E-KLASA-A',difficulty,index:0};
    const generated=await call(handlers.generate,assignment);assert.equal(generated.status,200);assert.equal('referenceFiles' in generated.data.assignment,false);
    const submissionId=randomUUID(),payload={...ids,eventId:submissionId,submissionId,studentId:'TEST-LOCAL',studentName:'',sentAt:123,assignment,files:generated.data.assignment.starterFiles};
    const result=await call(handlers.submit,payload);assert.equal(result.status,202);
    const channel={ack(){assert.ok(store.getSubmission(submissionId),'must commit before ACK');acked++;},nack(){throw Error('unexpected NACK');}};
    const message={content:Buffer.from(JSON.stringify(messages[0]))};
    processMessage(message,{store,channel,onChange(){}});processMessage(message,{store,channel,onChange(){}});
    const saved=store.getSubmission(submissionId);assert.equal(saved.studentId,'TEST-LOCAL');assert.ok(Object.keys(saved.assignment.referenceFiles).length);
    assert.deepEqual(saved.files,payload.files);store.reviewSubmission(submissionId,{grade:80,comment:'Test przepływu'});assert.equal(store.getSubmission(submissionId).review.grade,80);count++;
  }
  assert.equal(store.listSubmissions().length,24);assert.equal(acked,48);
  console.log(`PASS: ${count} generated variants, private references, authenticated publication, durable snapshots, idempotent retries and manual grading.`);
}finally{store.close();}
