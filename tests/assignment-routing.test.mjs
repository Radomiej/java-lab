import test from 'node:test';
import assert from 'node:assert/strict';
import {createRabbitPublisher} from '../server/telemetry/rabbitPublisher.js';
test('Java submission and telemetry use separate durable RabbitMQ destinations',async()=>{
  const calls=[];
  const publish=createRabbitPublisher({env:{RABBITMQ_HTTP_URL:'https://rabbit.test',RABBITMQ_USERNAME:'test',RABBITMQ_PASSWORD:'test'},fetchImpl:async(url,options)=>{calls.push(JSON.parse(options.body));return {ok:true,json:async()=>({routed:true})};}});
  await publish({kind:'submission',eventId:'submission-qa'});
  await publish({kind:'activity',eventId:'activity-qa'});
  assert.equal(calls[0].routing_key,'lab.submissions.v1');
  assert.equal(calls[1].routing_key,'java-lab.activity');
  for(const call of calls){assert.equal(call.properties.delivery_mode,2);assert.equal(call.properties.content_type,'application/json');}
});
