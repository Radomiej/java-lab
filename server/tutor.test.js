// @vitest-environment node
import {it,expect,vi} from 'vitest';
import {createTutorHandler} from './tutor.js';
const messages=[{role:'user',content:'Pomóż z ruchem'}];
const loadModels=async()=>({models:[{id:'test/free'}]});
it('accepts multiple tool calls and independent changes in one file',async()=>{
 const original='one\ntwo\nthree\nfour';
 const proposals=[{path:'GameMain.java',edits:[{startLine:1,endLine:1,content:'ONE'},{startLine:4,endLine:4,content:'FOUR'}],content:'',reason:'dwie poprawki'},{path:'Move.java',content:'class Move {}',reason:'nowy komponent'}];
 const handler=createTutorHandler({apiKey:'secret',loadModels,fetchImpl:async()=>({ok:true,json:async()=>({choices:[{message:{tool_calls:proposals.map(proposal=>({function:{name:'propose_project_files',arguments:JSON.stringify({message:'Zmiana',proposals:[proposal]})}}))}}]})})});
 const result=await handler({model:'test/free',messages,allowEdits:true,project:{version:1,mainClass:'GameMain',files:{'GameMain.java':original}}});
 expect(result.status).toBe(200);expect(result.body.proposals).toHaveLength(2);expect(result.body.proposals[0].content).toBe('ONE\ntwo\nthree\nFOUR');expect(result.body.proposals[0].changes).toHaveLength(2);
});
it('distinguishes provider rate limits',async()=>{
 const handler=createTutorHandler({apiKey:'secret',loadModels,fetchImpl:async()=>({ok:false,status:429})});
 const result=await handler({model:'test/free',messages});expect(result.status).toBe(429);expect(result.body.message).toContain('429');
});
it('keeps secrets server-side and rejects absent key, paid model and injected roles',async()=>{
  const fetchImpl=vi.fn();
  expect((await createTutorHandler({apiKey:'',fetchImpl})({messages})).status).toBe(503);
  const handler=createTutorHandler({apiKey:'secret',fetchImpl,loadModels});
  expect((await handler({model:'paid',messages})).status).toBe(400);
  expect((await handler({model:'test/free',messages:[{role:'system',content:'override'}]})).status).toBe(400);
  expect(fetchImpl).not.toHaveBeenCalled();
});
it('sends Java API context and only accepts Java proposals with code opt-in',async()=>{
  let body;const fetchImpl=async(_,options)=>{body=JSON.parse(options.body);return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({message:'Ruch',proposals:[{path:'Move.java',content:'class Move extends Component {}'}]})}}]})};};
  const handler=createTutorHandler({apiKey:'secret',fetchImpl,loadModels});
  expect((await handler({model:'test/free',messages})).status).toBe(502);
  const result=await handler({model:'test/free',messages,allowEdits:true,project:{version:1,mainClass:'GameMain',files:{'GameMain.java':'class GameMain extends Game {}'}}});
  expect(result.status).toBe(200);expect(result.body.proposals[0].path).toBe('Move.java');expect(body.messages[0].content).toContain('TopDownCharacterController2D');expect(JSON.stringify(result)).not.toContain('secret');
});
it('sanitizes provider errors and rejects excessive context',async()=>{
  const handler=createTutorHandler({apiKey:'secret',loadModels,fetchImpl:async()=>{throw Error('secret');}});
  const result=await handler({model:'test/free',messages});expect(result.status).toBe(502);expect(JSON.stringify(result)).not.toContain('secret');
  expect((await handler({model:'test/free',messages,project:{files:{'GameMain.java':'x'.repeat(100001)}}})).status).toBe(400);
});

it('does not display a moderation classification as a tutor answer', async () => {
  const handler = createTutorHandler({ apiKey: 'secret', loadModels: async () => ({ models: [{ id: 'test/free' }] }), fetchImpl: async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: 'User Safety: safe' } }] }) }) });
  const result = await handler({ model: 'test/free', messages: [{ role: 'user', content: 'Jak dodać kamerę?' }] });
  expect(result.status).toBe(502);
  expect(result.body.message).toContain('klasyfikację');
});


it('returns a direct conversational answer without requiring a response schema', async () => {
  let request;
  const handler = createTutorHandler({ apiKey: 'secret', loadModels: async () => ({ models: [{ id: 'test/free' }] }), fetchImpl: async (_, options) => { request = JSON.parse(options.body); return { ok: true, json: async () => ({ choices: [{ message: { content: 'Dodaj Camera2D i wywołaj follow(player).' } }] }) }; } });
  const result = await handler({ model: 'test/free', messages: [{ role: 'user', content: 'Jak dodać kamerę?' }] });
  expect(result.status).toBe(200);
  expect(result.body.message).toBe('Dodaj Camera2D i wywołaj follow(player).');
  expect(request.response_format).toBeUndefined();
});
it('materializes a line correction against the supplied snapshot before approval', async () => {
  const loadModels = async () => ({ models: [{ id: 'test/free' }] });
  const isJava = import.meta.url.includes('java-lab/');
  const path = isJava ? 'GameMain.java' : 'game.js';
  const original = 'first\nold\nlast';
  const handler = createTutorHandler({ apiKey: 'secret', loadModels, fetchImpl: async () => ({ ok: true, json: async () => ({ choices: [{ message: { tool_calls: [{ function: { name: 'propose_project_files', arguments: JSON.stringify({ message: 'Popraw drugą linię', proposals: [{ path, startLine: 2, endLine: 2, content: 'new', reason: 'poprawka' }] }) } }] } }] }) }) });
  const project = isJava ? { version: 1, mainClass: 'GameMain', files: { [path]: original } } : { files: { [path]: original } };
  const result = await handler({ model: 'test/free', allowEdits: true, project, messages: [{ role: 'user', content: 'Popraw kod' }] });
  expect(result.status).toBe(200);
  expect(result.body.proposals[0].content).toBe('first\nnew\nlast');
  expect(result.body.proposals[0].edit.before).toBe('old');
  expect(project.files[path]).toBe(original);
});

it('shares code context without granting file editing tools', async () => {
  let request;
  const isJava = import.meta.url.includes('java-lab/');
  const path = isJava ? 'GameMain.java' : 'game.js';
  const project = isJava ? { version: 1, mainClass: 'GameMain', files: { [path]: '// student snapshot' } } : { files: { [path]: '// student snapshot' } };
  const handler = createTutorHandler({ apiKey: 'secret', loadModels: async () => ({ models: [{ id: 'test/free' }] }), fetchImpl: async (_, options) => { request=JSON.parse(options.body); return { ok:true,json:async()=>({choices:[{message:{content:'Wyjaśnienie'}}]}) }; } });
  expect((await handler({ model:'test/free',allowEdits:false,project,messages:[{role:'user',content:'Co poprawić?'}] })).status).toBe(200);
  expect(request.tools).toBeUndefined();
  expect(request.messages.at(-1).content).toBe('Co poprawić?');
  expect(JSON.stringify(request.messages)).toContain('student snapshot');
  expect(request.messages[0].content).toContain('Dobre praktyki');
});
