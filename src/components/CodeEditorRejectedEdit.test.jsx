import {afterEach,it,expect,vi} from 'vitest';
import {cleanup,render,screen,fireEvent,waitFor} from '@testing-library/react';
import CodeEditor from './CodeEditor.jsx';
vi.mock('monaco-editor',()=>{throw new Error('Use fallback for this test');});
afterEach(cleanup);
it('keeps displayed source aligned with accepted files when a paste exceeds the project limit',async()=>{
 render(<CodeEditor runner={{status:'idle'}} files={{'GameMain.java':'class GameMain {}'}} activeFile="GameMain.java" onFileChange={()=>{}} onCodeChange={()=>{throw new Error('Limit 256 KiB');}}/>);
 await waitFor(()=>expect(document.querySelector('textarea')).toBeInTheDocument());
 fireEvent.change(document.querySelector('textarea'),{target:{value:'too large'}});
 expect(screen.getByRole('alert')).toHaveTextContent('Limit 256 KiB');
 expect(document.querySelector('textarea')).toHaveValue('class GameMain {}');
});
