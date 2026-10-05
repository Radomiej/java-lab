import {expect,it} from 'vitest';
import {createEngineDefinitionProvider,createEngineHoverProvider} from './javaEngineNavigation.js';
import {gameEngineRuntimeFiles} from '../data/gameEngineRuntime.js';

const line='        requireComponent(CharacterController2D.class).move(x, y, 120);';
function modelAt(word, content=line) {
  return {getWordAtPosition:()=>({word,startColumn:content.indexOf(word)+1,endColumn:content.indexOf(word)+word.length+1}),
    getLineContent:()=>content,getValue:()=>`public class PlayerController extends Component {\n${content}\n}`};
}

it('opens both sprite flip fields and explains their axes',()=>{
  for (const [field,axis] of [['flipX','lewo/prawo'],['flipY','góra/dół']]) {
    const model=modelAt(field,`requireComponent(Sprite.class).${field} = true;`);
    const definition=createEngineDefinitionProvider(gameEngineRuntimeFiles,file=>({uri:file}))
      .provideDefinition(model,{lineNumber:2,column:32});
    expect(definition.uri).toBe('Sprite.java');
    const hover=createEngineHoverProvider(gameEngineRuntimeFiles).provideHover(model,{lineNumber:2,column:32});
    expect(hover.contents.map(item=>item.value).join('\n')).toContain(axis);
  }
});

it('resolves the chained move call to the actual Java method', () => {
  const provider=createEngineDefinitionProvider(gameEngineRuntimeFiles,file=>({uri:`test://${file}`}));
  const definition=provider.provideDefinition(modelAt('move'),{lineNumber:2,column:56});
  expect(definition.uri).toBe('test://CharacterController2D.java');
  expect(gameEngineRuntimeFiles['CharacterController2D.java'].split('\n')[definition.range.startLineNumber-1]).toContain('void move(');
});

it('resolves the inherited requireComponent method and explains the generic type', () => {
  const definition=createEngineDefinitionProvider(gameEngineRuntimeFiles,file=>({uri:file}))
    .provideDefinition(modelAt('requireComponent'),{lineNumber:2,column:15});
  expect(definition.uri).toBe('Component.java');
  const hover=createEngineHoverProvider(gameEngineRuntimeFiles).provideHover(modelAt('requireComponent'),{lineNumber:2,column:15});
  const text=hover.contents.map(part=>part.value).join('\n');
  expect(text).toContain('Class<T> type');
  expect(text).toContain('IllegalArgumentException');
  expect(text).toContain('CharacterController2D.class');
});

it('documents speed, normalization and both overloads of move', () => {
  const hover=createEngineHoverProvider(gameEngineRuntimeFiles).provideHover(modelAt('move'),{lineNumber:2,column:56});
  const text=hover.contents.map(part=>part.value).join('\n');
  expect(text).toContain('double speed');
  expect(text).toContain('pikselach na sekundę');
  expect(text).toContain('200');
  expect(text).toContain('normalizuje');
});

it('does not send a user-owned move method to the engine', () => {
  const model=modelAt('move','        enemy.move(1);');
  expect(createEngineHoverProvider(gameEngineRuntimeFiles).provideHover(model,{lineNumber:2,column:16})).toBeNull();
});

it('explains tween parameters and completion in a hover',()=>{
  const model=modelAt('scale','Tweens.scale(gameObject, 2, 2, 0.5);');
  const hover=createEngineHoverProvider(gameEngineRuntimeFiles).provideHover(model,{lineNumber:2,column:9});
  expect(hover.contents.map(item=>item.value).join('\n')).toContain('sekundach');
  expect(hover.contents.map(item=>item.value).join('\n')).toContain('cancel');
});

it('resolves the engine definition without opening tabs during a Ctrl hover', () => {
  const opened=[];
  const provider=createEngineDefinitionProvider({'Sprite.java':'package engine;\npublic class Sprite {}'},
    file => ({uri:`test://${file}`}));
  expect(opened).toEqual([]);
  const result=provider.provideDefinition({getWordAtPosition:()=>({word:'Sprite'})}, {lineNumber:3,column:20});
  expect(result.uri).toBe('test://Sprite.java');
  expect(result.range.startLineNumber).toBe(2);
  expect(opened).toEqual([]);
  expect(provider.provideDefinition({getWordAtPosition:()=>({word:'StudentClass'})},{})).toBeNull();
});
