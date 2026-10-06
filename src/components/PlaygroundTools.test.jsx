import {afterEach,it,expect,vi} from 'vitest';
import {cleanup,render,screen,fireEvent,act} from '@testing-library/react';
import PlaygroundTools from './PlaygroundTools.jsx';
import {playgroundProject} from '../data/playground.js';
afterEach(()=>{cleanup();vi.restoreAllMocks();});
it('does not replace a project after navigating away while an import is being read',async()=>{
 let finish;const onImport=vi.fn();const confirm=vi.spyOn(window,'confirm').mockReturnValue(true);
 const view=render(<PlaygroundTools project={playgroundProject} onImport={onImport}/>);
 fireEvent.change(screen.getByLabelText('Plik JSON projektu gry'),{target:{files:[{size:100,text:()=>new Promise(resolve=>{finish=resolve;})}]}});
 view.unmount();await act(async()=>finish(JSON.stringify(playgroundProject)));
 expect(onImport).not.toHaveBeenCalled();expect(confirm).not.toHaveBeenCalled();
});
