import {expect,test} from 'vitest';
import {createJavaCompletionProvider} from './javaIntellisense.js';
const monaco={languages:{CompletionItemKind:{Method:1,Field:2,Class:3},CompletionItemInsertTextRule:{InsertAsSnippet:4}}};
function model(source) {return {getValue:()=>source,getOffsetAt:()=>source.length,getLineContent:()=>source.split('\n').at(-1),getWordUntilPosition:()=>({word:'',startColumn:1,endColumn:1})};}

test('suggests new instance methods, inherited members and fields from current unsaved files',()=>{
  let files={'Hero.java':'class Base { int hp; void heal(int amount) {} } class Hero extends Base { void run() {} }'};
  const provider=createJavaCompletionProvider(monaco,()=>files);
  const current=model('class Main { void play() { Hero hero = new Hero();\nhero.');
  const labels=()=>provider.provideCompletionItems(current,{lineNumber:2,column:6}).suggestions.map(s=>s.label);
  expect(labels()).toEqual(expect.arrayContaining(['heal','hp','run']));
  files={'Hero.java':'class Base { int hp; void heal(int amount) {} } class Hero extends Base { void jump() {} }'};
  expect(labels()).toContain('jump');
  expect(labels()).not.toContain('run');
});

test('ignores class and method lookalikes inside strings and comments',()=>{
  const files={'Hero.java':'class Hero { // void fake() {}\nString text = "void lie() {}"; void real() {} }'};
  const provider=createJavaCompletionProvider(monaco,()=>files);
  const items=provider.provideCompletionItems(model('Hero hero; hero.'),{lineNumber:1,column:17}).suggestions.map(s=>s.label);
  expect(items).toContain('real');expect(items).not.toContain('fake');expect(items).not.toContain('lie');
});

test('suggests student component methods after requireComponent and methods on this',()=>{
  const files={'Move.java':'class Move extends Component { public void dash() {} }'};
  const provider=createJavaCompletionProvider(monaco,()=>files);
  expect(provider.provideCompletionItems(model('requireComponent(Move.class).'),{lineNumber:1,column:29}).suggestions.map(s=>s.label)).toContain('dash');
  expect(provider.provideCompletionItems(model('class Player { void jump() {} void update() { this.'),{lineNumber:1,column:51}).suggestions.map(s=>s.label)).toContain('jump');
});

test('suggests newly written helper methods without requiring this dot',()=>{
  const provider=createJavaCompletionProvider(monaco);
  const current=model('class Hero { private void heal() {} void update() {\n');
  expect(provider.provideCompletionItems(current,{lineNumber:2,column:1}).suggestions.map(s=>s.label)).toContain('heal');
});
test('return expressions do not override the declared receiver type',()=>{
  const provider=createJavaCompletionProvider(monaco,()=>({'Hero.java':'class Hero { void dash() {} }'}));
  expect(provider.provideCompletionItems(model('class Main { Hero hero; Hero get(){ return hero.'),{lineNumber:1,column:48}).suggestions.map(s=>s.label)).toContain('dash');
});
