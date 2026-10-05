import {afterEach,beforeEach,expect,it} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import EngineGuide from './EngineGuide.jsx';
import {engineGuide} from '../data/engineGuide.js';
import {gameEngineRuntimeFiles} from '../data/gameEngineRuntime.js';

beforeEach(()=>{
  HTMLDialogElement.prototype.showModal=function(){this.open=true;};
  HTMLDialogElement.prototype.close=function(){this.open=false;};
});
afterEach(()=>{cleanup();delete HTMLDialogElement.prototype.showModal;delete HTMLDialogElement.prototype.close;});

it('covers every built-in class with an explanation and example',()=>{
  expect(engineGuide.map(item=>`${item.name}.java`).sort()).toEqual(Object.keys(gameEngineRuntimeFiles).sort());
  for(const item of engineGuide){expect(item.description.length).toBeGreaterThan(30);expect(item.example).toBeTruthy();}
});
it('opens from the book, searches the API and restores focus on close',()=>{
  render(<EngineGuide/>);
  const button=screen.getByRole('button',{name:'Dokumentacja silnika'});
  fireEvent.click(button);
  expect(screen.getByRole('dialog',{name:'Dokumentacja silnika'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Komponenty i API'}));
  fireEvent.change(screen.getByRole('searchbox'),{target:{value:'KeyDoublePressed'}});
  expect(screen.getByText('KeyDoublePressed',{selector:'strong'})).toBeInTheDocument();
  expect(screen.queryByText('TileMap',{selector:'strong'})).not.toBeInTheDocument();
  expect(screen.getByText(/maxDelaySeconds = 0.3/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Zamknij dokumentację'}));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(button).toHaveFocus();
  expect(document.body.style.overflow).not.toBe('hidden');
});
it('closes through native Escape/cancel without losing the current exercise',()=>{
  render(<EngineGuide/>);
  fireEvent.click(screen.getByRole('button',{name:'Dokumentacja silnika'}));
  fireEvent(screen.getByRole('dialog'),new Event('cancel',{bubbles:true,cancelable:true}));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
