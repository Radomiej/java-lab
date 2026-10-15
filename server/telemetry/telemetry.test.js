// @vitest-environment node
import {test,expect} from 'vitest';
import {randomUUID} from 'node:crypto';
import {validateEvent} from '../../shared/telemetry/schema.js';
import {issueToken,verifyToken} from './token.js';
import {createRabbitPublisher} from './rabbitPublisher.js';
export const sample=()=>({version:1,eventId:randomUUID(),machineId:randomUUID(),sessionId:randomUUID(),sequence:1,type:'snapshot',sentAt:Date.now(),snapshot:{lessonId:'101',lessonTitle:'Zmienne',taskId:'a',activeFile:'Main.java',files:{'Main.java':'class Main {}'},runnerStatus:'idle',output:'',passed:null,visibility:'visible'}});
test('validates snapshots and strips unrelated fields',()=>{expect(validateEvent({...sample(),secret:'x'}).secret).toBeUndefined();});
test('rejects invalid IDs, sequence, prototype keys and UTF8 oversized content',()=>{
 for(const patch of [{machineId:'x'},{sequence:-1},{type:'unknown'},{snapshot:{...sample().snapshot,files:JSON.parse('{"__proto__":"x"}')}},{snapshot:{...sample().snapshot,files:{'Main.java':'ą'.repeat(140000)}}}])expect(()=>validateEvent({...sample(),...patch})).toThrow();
});
test('session tokens bind identity, expire and reject tampering',()=>{const event=sample(),secret='a'.repeat(40),token=issueToken(event,secret,1000);expect(verifyToken(token,secret,1001).sessionId).toBe(event.sessionId);expect(()=>verifyToken(token+'x',secret,1001)).toThrow();expect(()=>verifyToken(token,secret,3601001)).toThrow();});
test('publisher requires routing and persistent messages without leaking broker errors',async()=>{let body;const env={RABBITMQ_HTTP_URL:'https://rabbit.test',RABBITMQ_USERNAME:'u',RABBITMQ_PASSWORD:'p'};const publish=createRabbitPublisher({env,fetchImpl:async(url,options)=>{body=JSON.parse(options.body);return {ok:true,json:async()=>({routed:true})};}});await publish(sample());expect(body.properties.delivery_mode).toBe(2);expect(body.routing_key).toBe('java-lab.activity');await expect(createRabbitPublisher({env,fetchImpl:async()=>({ok:true,json:async()=>({routed:false})})})(sample())).rejects.toThrow();});
