import {it,expect} from 'vitest';
import {applyTutorProposal,validateProposals} from './tutorProposals.js';
const project={version:1,mainClass:'GameMain',files:{'GameMain.java':'class GameMain {}','Extra.java':'class Extra {}'}};
it('adds and deletes files only when approved without changing the snapshot',()=>{
 const added=applyTutorProposal(project,project,{path:'New.java',content:'class New {}'});
 expect(added.files['New.java']).toBe('class New {}');expect(project.files['New.java']).toBeUndefined();
 const removed=applyTutorProposal(project,project,{operation:'delete',path:'Extra.java'});
 expect(removed.files['Extra.java']).toBeUndefined();expect(project.files['Extra.java']).toBe('class Extra {}');
});
it('protects the entry file, rejects missing files and stale deletions',()=>{
 expect(()=>validateProposals([{operation:'delete',path:'GameMain.java'}])).toThrow('startowego');
 expect(()=>applyTutorProposal(project,project,{operation:'delete',path:'Missing.java'})).toThrow('nie istnieje');
 expect(()=>applyTutorProposal({...project,files:{...project.files,'Extra.java':'student'}},project,{operation:'delete',path:'Extra.java'})).toThrow('zmienił');
});
