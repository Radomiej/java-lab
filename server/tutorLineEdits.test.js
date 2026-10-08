// @vitest-environment node
import { it, expect } from 'vitest';
import { materializeLineEdits } from '../shared/lab-game-v2/tutorLineEdits.js';
import { applyTutorProposal } from '../src/services/tutorProposals.js';

it('inserts before a line and preserves CRLF and surrounding code', () => {
  const [proposal] = materializeLineEdits([{ path:'GameMain.java', startLine:2, endLine:1, content:'camera\nfollow' }], {'GameMain.java':'first\r\nlast'});
  expect(proposal.content).toBe('first\r\ncamera\r\nfollow\r\nlast');
  expect(proposal.edit.before).toBe('');
});
it('derives the smallest changed range from a full-file answer', () => {
  const [proposal] = materializeLineEdits([{ path:'GameMain.java', content:'first\nnew\nlast' }], {'GameMain.java':'first\nold\nlast'});
  expect(proposal.edit).toEqual({startLine:2,endLine:2,before:'old',after:'new'});
});
it('rejects missing files and invalid line numbers', () => {
  for (const range of [[0,1],[1,99],[2,0],[1.5,2]]) {
    expect(()=>materializeLineEdits([{path:'GameMain.java',startLine:range[0],endLine:range[1],content:'new'}],{'GameMain.java':'old'})).toThrow();
  }
  expect(()=>materializeLineEdits([{path:'missing.java',startLine:1,endLine:1,content:'new'}],{})).toThrow();
});
it('blocks approval if the student edited the file since the request', () => {
  const snapshot={version:1,mainClass:'GameMain',files:{'GameMain.java':'old'}};
  const current={...snapshot,files:{'GameMain.java':'student edit'}};
  const [proposal]=materializeLineEdits([{path:'GameMain.java',startLine:1,endLine:1,content:'new'}],snapshot.files);
  expect(()=>applyTutorProposal(current,snapshot,proposal)).toThrow('Plik zmienił się');
  expect(current.files['GameMain.java']).toBe('student edit');
});

it('combines disjoint changes against original line numbers and rejects overlaps',()=>{
 const files={'GameMain.java':'first\nsecond\nthird\nfourth'};
 const [proposal]=materializeLineEdits([{path:'GameMain.java',edits:[{startLine:1,endLine:1,content:'A\nB'},{startLine:4,endLine:4,content:'D'}]}],files);
 expect(proposal.content).toBe('A\nB\nsecond\nthird\nD');expect(proposal.changes).toHaveLength(2);
 expect(()=>materializeLineEdits([{path:'GameMain.java',edits:[{startLine:1,endLine:2,content:'A'},{startLine:2,endLine:3,content:'B'}]}],files)).toThrow('nakładają');
});
