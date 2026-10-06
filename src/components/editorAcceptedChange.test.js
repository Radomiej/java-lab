import {it,expect,vi} from 'vitest';
import {acceptEditorChange} from './editorAcceptedChange.js';
it('reports rejected edits without advancing the accepted model',()=>{
 const error=vi.fn();const rollback=vi.fn();
 expect(acceptEditorChange(()=>{throw new Error('Limit 256 KiB');},error,rollback)).toBe(false);
 expect(error).toHaveBeenCalledWith('Limit 256 KiB');expect(rollback).toHaveBeenCalledOnce();
});
it('accepts valid edits and clears the previous error',()=>{
 const error=vi.fn();const rollback=vi.fn();
 expect(acceptEditorChange(()=>{},error,rollback)).toBe(true);
 expect(error).toHaveBeenCalledWith('');expect(rollback).not.toHaveBeenCalled();
});
