import { describe,it,expect } from 'vitest';
import { parseGameProject, serializeGameProject } from './gameProjectTransfer.js';
import { validateProposals,applyTutorProposal } from './tutorProposals.js';
const project={version:1,engineApiVersion:'2.0.0',mainClass:'GameMain',files:{'GameMain.java':'public class GameMain extends Game {}','Player.java':'class Player {}'}};
it('round trips exports close to the byte limit',()=>{
  const large={...project,files:{'GameMain.java':'x'.repeat(262000)}};
  expect(parseGameProject(serializeGameProject(large))).toEqual(large);
});
it('rejects duplicate JSON members including escaped filenames',()=>{
  expect(()=>parseGameProject('{"version":1,"mainClass":"GameMain","files":{"GameMain.java":"first","GameMain.java":"second"}}')).toThrow(/Powtórzony/);
  expect(()=>parseGameProject('{"version":1,"mainClass":"GameMain","files":{"GameMain.java":"first","GameMain\\u002ejava":"second"}}')).toThrow(/Powtórzony/);
});
it('round trips only Java source, never secrets or history',()=>{
  const text=serializeGameProject({...project,apiKey:'secret',messages:['private']});
  expect(parseGameProject(text)).toEqual(project);expect(text).not.toContain('secret');expect(text).not.toContain('private');
});
it.each(['../Bad.java','/Bad.java','engine/Game.java','Game.java','GameLauncher.java','Main.java','evil.js','__proto__.java'])('rejects unsafe or reserved filename %s',name=>{
  expect(()=>parseGameProject(JSON.stringify({...project,files:{...project.files,[name]:'code'}}))).toThrow();
});
it('rejects unsupported, oversized and entryless projects',()=>{
  expect(()=>parseGameProject(JSON.stringify({...project,version:2}))).toThrow();
  expect(()=>parseGameProject(JSON.stringify({...project,files:{'Player.java':'x'}}))).toThrow();
  expect(()=>parseGameProject(JSON.stringify({...project,files:{'GameMain.java':'ą'.repeat(140000)}}))).toThrow();
});
it('requires a current snapshot for tutor changes and protects engine files',()=>{
  const proposal={path:'Player.java',content:'class Player { int hp; }',reason:'health'};
  expect(applyTutorProposal(project,project,proposal).files['Player.java']).toBe(proposal.content);
  expect(()=>applyTutorProposal({...project,files:{...project.files,'Player.java':'changed'}},project,proposal)).toThrow(/zmienił/);
  expect(()=>validateProposals([{...proposal,path:'Game.java'}])).toThrow();
  expect(()=>validateProposals([proposal,proposal])).toThrow();
});
