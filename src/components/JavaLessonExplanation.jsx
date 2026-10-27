import { useState } from 'react';
import { javaConceptPages } from '../data/javaConceptPages.js';
import SharedExplanation from '../../shared/lab-game-v2/editor/LessonExplanation.jsx';
import CodeExample from '../../shared/lab-game-v2/editor/CodeExample.jsx';
import { assetManifest } from '../../shared/lab-game-v2/assets/Assets.js';
import { gameExplanationPages } from '../../shared/lab-game-v2/editor/lessonVisuals.js';
import PageDiagram from '../../shared/lab-game-v2/editor/PageDiagram.jsx';
import { gameConceptScenes } from '../data/gameConceptScenes.js';
import { gameIntroPages } from '../data/gameIntroPages.js';
import GameIntroDiagram from './GameIntroDiagram.jsx';
import './JavaLessonExplanation.css';
import ConsoleOutput from './ConsoleOutput.jsx';

function Hero({ kind }) {
  if (kind === 'bag') return <svg className="concept-hero" viewBox="0 0 128 128" aria-hidden="true"><path d="M48 32V23h32v9" fill="none" stroke="#684733" strokeWidth="8"/><rect x="28" y="32" width="72" height="76" rx="16" fill="#ad7748" stroke="#684733" strokeWidth="5"/><path d="M28 52h72v16H28z" fill="#d4a364" stroke="#684733" strokeWidth="4"/><rect x="57" y="55" width="14" height="22" rx="3" fill="#f7d779"/><rect x="43" y="82" width="42" height="20" rx="6" fill="#825739"/></svg>;
  const asset = assetManifest.assets.find(item => item.key === kind);
  return <svg className="concept-hero" viewBox={`${asset.frame.x} ${asset.frame.y} ${asset.frame.w} ${asset.frame.h}`} aria-hidden="true">
    <image href={`${import.meta.env.BASE_URL}game-assets/${asset.source}`} width="640" height="640" />
  </svg>;
}

function Pages({ pages, lessonId, tips = [] }) {
  const [index, setIndex] = useState(0);
  const page = pages[index];
  return <section className="lesson-explanation java-concept" aria-label="Wyjaśnienie zagadnienia">
    <header className="explanation-header"><span>ZOBACZ, JAK TO DZIAŁA</span><span>{index + 1} / {pages.length}</span></header>
    <article className="explanation-copy" aria-live="polite">
      <h2>{page.title}</h2><p>{page.text}</p>
      {index === 0 && javaConceptPages[lessonId] && <figure className="java-course-infographic"><a href={`${import.meta.env.BASE_URL}course-assets/java-concepts/${lessonId}.png`} target="_blank" rel="noreferrer" aria-label={`Otwórz infografikę: ${page.title}`}><img src={`${import.meta.env.BASE_URL}course-assets/java-concepts/${lessonId}.png`} alt={page.title} loading="lazy" /></a></figure>}
      {page.introDiagram ? <GameIntroDiagram kind={page.introDiagram} title={page.title}/> : index === 0 && javaConceptPages[lessonId] ? null : page.actors ? <div className="concept-scene" aria-label={page.title}>
        {page.actors.map((actor, number) => <div className="concept-actor" key={number}>
          <h3>{actor.name}</h3><Hero kind={actor.sprite} />
          <pre className="concept-state">{actor.state}</pre>
          {actor.effect && <span className="concept-effect">{['Miecz', 'Czar'].includes(actor.effect) && <Hero kind={actor.effect === 'Miecz' ? 'slash' : 'magic-burst'} />}{actor.effect}</span>}
        </div>)}
      </div> : page.visual ? <PageDiagram page={page} /> : null}
      {page.setupCode&&<><p className="game-intro-code-context">GameMain.onCreate(): dodaj do przygotowanego Player</p><CodeExample code={page.setupCode}/></>}
      {page.code && <>{page.codeContext&&<p className="game-intro-code-context">{page.codeContext}</p>}<CodeExample code={typeof page.code === 'object' ? page.code.java : page.code} /></>}
      {page.result && (page.result.endsWith('\n')
        ? <ConsoleOutput key={page.title} label="Wyjście tego przykładu" output={page.result} />
        : <div className="concept-result"><span>Efekt tego przykładu</span><pre>{page.result}</pre></div>)}
    </article>
    <nav className="explanation-pagination" aria-label="Strony wyjaśnienia">
      <button type="button" aria-label="Poprzedni krok" title="Poprzedni krok" disabled={!index} onClick={() => setIndex(index - 1)}>←</button>
      <div className="explanation-pages">{pages.map((item, number) => <button type="button" key={item.title} aria-label={`Krok ${number + 1}`} title={item.title} aria-current={index === number ? 'step' : undefined} onClick={() => setIndex(number)}>{number + 1}</button>)}</div>
      <button type="button" aria-label="Następny krok" title="Następny krok" disabled={index === pages.length - 1} onClick={() => setIndex(index + 1)}>→</button>
    </nav>
    {tips.length > 0 && <aside className="tips-row"><strong>Zapamiętaj</strong><span>{tips.join(' ')}</span></aside>}
  </section>;
}

export function ConceptPreview({ page }) {
  return <Pages pages={[page]} />;
}

export default function JavaLessonExplanation({ lesson }) {
  const pages = conceptPages(lesson);
  return pages ? <Pages key={lesson.id} pages={pages} lessonId={lesson.id} tips={lesson.tips} /> : <SharedExplanation lesson={lesson} language="java" />;
}

export function conceptPages(lesson) {
  if (gameIntroPages[lesson.id]) return lesson.id === 'g2d.input'
    ? [...gameIntroPages[lesson.id], ...gameExplanationPages.input.slice(1).map((page, index) => page.visual.kind === 'flow' && gameConceptScenes[`input:${index + 1}`]
      ? { ...page, actors: gameConceptScenes[`input:${index + 1}`], visual: undefined }
      : page)]
    : gameIntroPages[lesson.id];
  if (javaConceptPages[lesson.id]) return javaConceptPages[lesson.id];
  const chapter = lesson.id?.replace(/^g2d\./, '');
  if (!lesson.id?.startsWith('g2d.') || !gameExplanationPages[chapter]) return null;
  return gameExplanationPages[chapter].map((page, index) => page.visual.kind === 'flow' && gameConceptScenes[`${chapter}:${index}`]
    ? { ...page, actors: gameConceptScenes[`${chapter}:${index}`], visual: undefined }
    : chapter === 'health' && index === 0
      ? { ...page, text: 'Health przechowuje HP tej jednostki. damage(1) odejmuje jeden punkt: 5 → 4. Kontakt wykrywa collider; obrażenia zadaje osobny komponent.', code: undefined }
      : page);
}
