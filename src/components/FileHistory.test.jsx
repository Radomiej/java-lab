import {act,cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,test,vi} from 'vitest';
import FileHistory from './FileHistory.jsx';
import {recordFileVersion} from '../services/fileHistory.js';
afterEach(()=>{cleanup();localStorage.clear();});
test('shows exact historical content and restores the selected version explicitly',()=>{
  recordFileVersion('task','Main.java','class Old {}','initial',1000);
  recordFileVersion('task','Main.java','class New {}','paste',2000);
  const restore=vi.fn();
  render(<FileHistory workspace="task" file="Main.java" onRestore={restore} />);
  fireEvent.click(screen.getByRole('button',{name:'Historia pliku'}));
  expect(screen.getByText('class New {}')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Wersja'),{target:{value:'1000'}});
  expect(screen.getByText('class Old {}')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Przywróć tę wersję'}));
  expect(restore).toHaveBeenCalledWith('class Old {}');
  fireEvent.click(screen.getByRole('button',{name:'Zamknij historię'}));
  expect(screen.queryByText('class Old {}')).not.toBeInTheDocument();
  expect(screen.getByRole('button',{name:'Historia pliku'})).toHaveFocus();
});
test('opening flushes pending edits and visible history refreshes when a version arrives',()=>{
  recordFileVersion('task','Main.java','old','initial',1000);
  const flush=()=>recordFileVersion('task','Main.java','pending','typing',2000);
  window.addEventListener('java-lab-history-flush',flush);
  try {
    render(<FileHistory workspace="task" file="Main.java" onRestore={()=>{}} />);
    fireEvent.click(screen.getByRole('button',{name:'Historia pliku'}));
    expect(screen.getByText('pending')).toBeInTheDocument();
    act(()=>recordFileVersion('task','Main.java','latest','external',3000));
    expect(screen.getByText('latest')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  } finally {window.removeEventListener('java-lab-history-flush',flush);}
});
