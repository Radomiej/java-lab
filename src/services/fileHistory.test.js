import {beforeEach,expect,test} from 'vitest';
import {recordFileVersion,readFileVersions,syncModelSource} from './fileHistory.js';
beforeEach(()=>localStorage.clear());
test('records separate file versions, coalesces typing, retains before/after paste and isolates tasks',()=>{
  recordFileVersion('task','Main.java','a','initial',1000);
  recordFileVersion('task','Main.java','ab','typing',2000);
  recordFileVersion('task','Main.java','abc','typing',2200);
  recordFileVersion('task','Main.java','pasted','paste',2300);
  recordFileVersion('other','Main.java','other','typing',2400);
  expect(readFileVersions('task','Main.java').map(v=>v.content)).toEqual(['a','abc','pasted']);
  expect(readFileVersions('other','Main.java')).toHaveLength(1);
});
test('external source replacement creates an undoable model edit, never setValue',()=>{
  let value='old',undo=[];
  const model={getValue:()=>value,getFullModelRange:()=>({}),pushStackElement(){},pushEditOperations(_,ops){undo.push(value);value=ops[0].text;},setValue(){throw Error('undo lost');}};
  syncModelSource(model,'new');
  expect(value).toBe('new');expect(undo).toEqual(['old']);
  syncModelSource(model,'new');expect(undo).toHaveLength(1);
});
test('rapid external edits remain separately selectable even within the same millisecond',()=>{
  recordFileVersion('task','Main.java','a','initial',1000);
  recordFileVersion('task','Main.java','b','external',1000);
  expect(new Set(readFileVersions('task','Main.java').map(v=>v.time)).size).toBe(2);
});
test('oversized snapshot is rejected without evicting earlier history',()=>{
  recordFileVersion('task','Main.java','old','initial',1000);
  expect(()=>recordFileVersion('task','Main.java','x'.repeat(750001),'paste',2000)).toThrow();
  expect(readFileVersions('task','Main.java').map(v=>v.content)).toEqual(['old']);
});
