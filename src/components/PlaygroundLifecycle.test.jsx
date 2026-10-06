import {afterEach,it,expect,vi} from 'vitest';
import {act,cleanup,render,screen,fireEvent,waitFor} from '@testing-library/react';
import App from '../App.jsx';
afterEach(()=>{cleanup();vi.unstubAllGlobals();vi.restoreAllMocks();localStorage.clear();delete globalThis.__JAVA_LAB_FEATURE_FLAGS__;});
it('runs playground only in game mode, does not grade it and stops when the feature is disabled',async()=>{
  vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({setTransform(){},fillRect(){},fillText(){}});
  const posted=[];let terminated=false;
  class TestWorker{
    listeners=[];addEventListener(type,cb){if(type==='message')this.listeners.push(cb);}
    emit(data){this.listeners.forEach(cb=>cb({data}));}
    postMessage(message){posted.push(message);if(message.command==='initialize')queueMicrotask(()=>this.emit({command:'ready'}));if(message.command==='compile-and-run')queueMicrotask(()=>this.emit({command:'result',id:message.id,ok:true,output:''}));}
    terminate(){terminated=true;}
  }
  vi.stubGlobal('Worker',TestWorker);
  render(<App/>);fireEvent.click(screen.getByRole('tab',{name:/Playground/}));fireEvent.click(screen.getByRole('button',{name:/RUN/}));
  await screen.findByText('Gra gotowa');
  const requests=posted.filter(item=>item.command==='compile-and-run');expect(requests).toHaveLength(1);expect(requests[0].mode).toBe('game');expect(requests[0].mainClass).toBe('lab.GameLauncher');
  const progress=JSON.parse(localStorage.getItem('java-lab-progress-v1'));expect(progress.completedTasks).not.toContain('playground-game-project');
  act(()=>{globalThis.__JAVA_LAB_FEATURE_FLAGS__={'game-dev.enabled':false};window.dispatchEvent(new Event('java-lab-feature-flags-changed'));});
  await waitFor(()=>expect(screen.queryByRole('button',{name:'Pomoc AI'})).not.toBeInTheDocument());expect(screen.queryByRole('tab',{name:/Playground/})).not.toBeInTheDocument();expect(posted.some(m=>m.command==='game-stop')||terminated).toBe(true);
});
