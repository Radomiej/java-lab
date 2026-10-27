import {render,screen,fireEvent} from '@testing-library/react';
import {test,expect} from 'vitest';
import {gameIntroPages} from '../../shared/lab-game-v2/editor/gameIntroPages.js';
import GameIntroDiagram from '../../shared/lab-game-v2/editor/GameIntroDiagram.jsx';
import {conceptPages} from './JavaLessonExplanation.jsx';

test('keeps held-key and remembered-direction explanations after the new movement introduction',()=>{
 const pages=conceptPages({id:'g2d.input'});
 expect(pages).toHaveLength(8);
 expect(pages.slice(-3).map(page=>page.title)).toEqual(['Przytrzymanie czy nowe naciśnięcie?','Kierunek zostaje po zatrzymaniu','Jak pobrać komponent z obiektu?']);
});
test('each of the sixteen introductory pages has a dedicated labelled visual',()=>{
 for(const page of Object.values(gameIntroPages).flat()){
  const view=render(<GameIntroDiagram kind={page.introDiagram} title={page.title}/>);
  expect(screen.getByRole('figure',{name:`Schemat: ${page.title}`})).toBeInTheDocument();
  expect(view.container.querySelector('iframe')).toBeNull();view.unmount();
 }
});
test('changing only X preserves Y and can be reversed',()=>{
 render(<GameIntroDiagram kind="position-change" title="Pozycja"/>);
 expect(screen.getByRole('img',{name:'Ten sam obiekt w (100,150)'})).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Zmień tylko X: 100 → 220'}));
 expect(screen.getByRole('img',{name:'Ten sam obiekt w (220,150)'})).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Pokaż przed zmianą'}));
 expect(screen.getByRole('img',{name:'Ten sam obiekt w (100,150)'})).toBeInTheDocument();
});
