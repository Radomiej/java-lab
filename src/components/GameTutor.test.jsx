import {afterEach,it,expect,vi} from 'vitest';
import {cleanup,render,fireEvent,screen,waitFor} from '@testing-library/react';
import GameTutor from './GameTutor.jsx';
afterEach(cleanup);
it('cancels an in-flight answer on closing without applying or displaying it later',async()=>{
 let finish;let signal;
 const onApply=vi.fn();const sendMessage=vi.fn((payload,options)=>{signal=options.signal;return new Promise(resolve=>{finish=resolve;});});
 render(<GameTutor project={project} projectRevision={0} onApply={onApply} loadConfig={loadConfig} sendMessage={sendMessage}/>);
 fireEvent.click(screen.getByRole('button',{name:'Pomoc AI'}));await screen.findByText('Free test');
 fireEvent.change(screen.getByLabelText('Twoje pytanie'),{target:{value:'pomoc'}});fireEvent.click(screen.getByRole('button',{name:'Wyślij pytanie'}));
 fireEvent.click(screen.getByRole('button',{name:'Zamknij panel korepetytora'}));expect(signal.aborted).toBe(true);
 finish({message:'obsolete',proposals:[]});
 fireEvent.click(screen.getByRole('button',{name:'Pomoc AI'}));await screen.findByText('Free test');
 expect(screen.queryByText('obsolete')).not.toBeInTheDocument();expect(onApply).not.toHaveBeenCalled();
});
const project={version:1,mainClass:'GameMain',files:{'GameMain.java':'class GameMain extends Game {}'}};
const loadConfig=async()=>({configured:true,models:[{id:'test/free',name:'Free test'}]});
it('does not share source by default, renders inert text and closes with Escape',async()=>{
  const sendMessage=vi.fn(async()=>({message:'<script>bad()</script>',proposals:[]}));
  render(<GameTutor project={project} projectRevision={0} onApply={()=>{}} loadConfig={loadConfig} sendMessage={sendMessage}/>);
  fireEvent.click(screen.getByRole('button',{name:'Pomoc AI'}));await screen.findByText('Free test');
  expect(screen.getByRole('checkbox')).not.toBeChecked();
  fireEvent.change(screen.getByLabelText('Twoje pytanie'),{target:{value:'pomoc'}});fireEvent.click(screen.getByRole('button',{name:'Wyślij pytanie'}));
  await screen.findByText('<script>bad()</script>');expect(sendMessage.mock.calls[0][0].project).toEqual(project);expect(sendMessage.mock.calls[0][0].allowEdits).toBe(false);expect(document.querySelector('script')).toBeNull();
  fireEvent.keyDown(screen.getByLabelText('Twoje pytanie'),{key:'Escape'});expect(screen.queryByLabelText('Twoje pytanie')).not.toBeInTheDocument();await waitFor(()=>expect(screen.getByRole('button',{name:'Pomoc AI'})).toHaveFocus());
});
it('only applies opted-in Java proposals after explicit approval',async()=>{
  const onApply=vi.fn();const sendMessage=vi.fn(async()=>({message:'Dodaj ruch',proposals:[{path:'Move.java',content:'class Move extends Component {}',reason:'ruch'}]}));
  render(<GameTutor project={project} projectRevision={0} onApply={onApply} loadConfig={loadConfig} sendMessage={sendMessage}/>);
  fireEvent.click(screen.getByRole('button',{name:'Pomoc AI'}));await screen.findByText('Free test');fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.change(screen.getByLabelText('Twoje pytanie'),{target:{value:'dodaj'}});fireEvent.click(screen.getByRole('button',{name:'Wyślij pytanie'}));await screen.findByRole('heading',{name:'Dodaj: Move.java'});
  expect(sendMessage.mock.calls[0][0].project).toEqual(project);expect(onApply).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'Zastosuj Move.java'}));await waitFor(()=>expect(onApply).toHaveBeenCalledOnce());
});

it('sends with Enter and leaves Shift+Enter and composition for text entry', async () => {
 const sendMessage=vi.fn(async()=>({message:'Odpowiedź',proposals:[]}));
 render(<GameTutor project={project} projectRevision={0} onApply={()=>{}} loadConfig={loadConfig} sendMessage={sendMessage}/>);
 fireEvent.click(screen.getByRole('button',{name:'Pomoc AI'})); await screen.findByText('Free test');
 const input=screen.getByLabelText('Twoje pytanie');
 fireEvent.change(input,{target:{value:'Kamera'}});
 fireEvent.keyDown(input,{key:'Enter',shiftKey:true}); expect(sendMessage).not.toHaveBeenCalled();
 fireEvent.keyDown(input,{key:'Enter',isComposing:true}); expect(sendMessage).not.toHaveBeenCalled();
 fireEvent.keyDown(input,{key:'Enter'}); await waitFor(()=>expect(sendMessage).toHaveBeenCalledOnce());
 expect(sendMessage.mock.calls[0][0].messages.at(-1).content).toBe('Kamera');
});

it('retries the same request without duplicate messages and shows live text before completion',async()=>{
 let finish;let streamed;
 const sendMessage=vi.fn().mockRejectedValueOnce(new Error('Provider failed')).mockImplementationOnce((payload,options)=>{streamed=options.onEvent;return new Promise(resolve=>{finish=resolve;});});
 render(<GameTutor project={project} projectRevision={0} onApply={()=>{}} loadConfig={loadConfig} sendMessage={sendMessage}/>);
 fireEvent.click(screen.getByRole('button',{name:'Pomoc AI'}));await screen.findByText('Free test');
 fireEvent.change(screen.getByLabelText('Twoje pytanie'),{target:{value:'Jak dodać kamerę?'}});fireEvent.click(screen.getByRole('button',{name:'Wyślij pytanie'}));await screen.findByText('Provider failed');
 fireEvent.click(screen.getByRole('button',{name:'Spróbuj ponownie'}));await waitFor(()=>expect(sendMessage).toHaveBeenCalledTimes(2));
 expect(sendMessage.mock.calls[1][0].messages).toEqual(sendMessage.mock.calls[0][0].messages);
 expect(screen.getAllByText('Jak dodać kamerę?')).toHaveLength(1);
 streamed({type:'delta',text:'Dodaj Camera2D.'});await screen.findByText('Dodaj Camera2D.');
 finish({message:'Dodaj Camera2D.',proposals:[]});await waitFor(()=>expect(screen.queryByRole('button',{name:'Anuluj'})).not.toBeInTheDocument());
 expect(screen.getAllByText('Dodaj Camera2D.')).toHaveLength(1);
});

