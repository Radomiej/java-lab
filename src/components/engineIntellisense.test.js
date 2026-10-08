import {expect,it} from 'vitest';
import {createEngineCompletionProvider,createEngineSignatureProvider} from './engineIntellisense.js';
const monaco={languages:{CompletionItemKind:{Method:1,Field:2,Class:3,Constructor:4},CompletionItemInsertTextRule:{InsertAsSnippet:4}}};
function model(source){return {getValue:()=>source,getOffsetAt:()=>source.length,getWordUntilPosition:()=>{const word=source.match(/\w*$/)[0];return {word,startColumn:source.length-word.length+1,endColumn:source.length+1};}};}
const position={lineNumber:1,column:1};
it('completes typed API receivers, inherited methods and enum assets',()=>{
  const provider=createEngineCompletionProvider(monaco);
  const suggestions=provider.provideCompletionItems(model('CharacterController2D controller; controller.mo'),position).suggestions;
  expect(suggestions.find(s=>s.detail.includes('double speed')).insertText).toBe('move(${1:x}, ${2:y}, ${3:speed})');
  expect(provider.provideCompletionItems(model('CircleCollider2D collider; collider.onC'),position).suggestions.some(s=>s.label==='onContactEnter')).toBe(true);
  expect(provider.provideCompletionItems(model('Assets.FIRE'),position).suggestions.some(s=>s.label==='FIREBALL')).toBe(true);
});
it('shows constructor and method signatures with the active argument',()=>{
  const provider=createEngineSignatureProvider();
  const move=provider.provideSignatureHelp(model('CharacterController2D controller; controller.move(1, 1,'),position);
  expect(move.value.activeParameter).toBe(2);
  expect(move.value.signatures[move.value.activeSignature].label).toContain('double speed');
  const sprite=provider.provideSignatureHelp(model('new Sprite(Assets.PLAYER01,'),position);
  expect(sprite.value.signatures.length).toBeGreaterThan(0);
  expect(provider.provideSignatureHelp(model('getGame().input.isKeyDown("a,b"'),position).value.activeParameter).toBe(0);
});
