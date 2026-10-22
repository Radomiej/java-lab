// Zrzuca pełną treść lekcji game-dev (strony wyjaśnień, teoria, zadania)
// dokładnie tak, jak składa ją JavaLessonExplanation + curriculum.
import { writeFileSync } from 'node:fs';
import { courseManifest, defaultCourseScaffolding } from '../shared/lab-game-v2/course/manifest.js';
import { gameExplanationPages } from '../shared/lab-game-v2/editor/lessonVisuals.js';
import { gameIntroPages } from '../src/data/gameIntroPages.js';
import { gameConceptScenes } from '../src/data/gameConceptScenes.js';
import { gameDevTeaching } from '../src/data/gameDevTeaching.js';
import { studentGameCriteria } from '../src/data/gameDevStudentCopy.js';

const F = {
  intro: 'src/data/gameIntroPages.js',
  visuals: 'shared/lab-game-v2/editor/lessonVisuals.js',
  scenes: 'src/data/gameConceptScenes.js',
  teaching: 'src/data/gameDevTeaching.js',
  course: 'src/data/lessons/gameDevCourse.js',
  manifest: 'shared/lab-game-v2/course/manifest.js',
  copy: 'src/data/gameDevStudentCopy.js',
  jsx: 'src/components/JavaLessonExplanation.jsx',
};

function conceptPages(lessonId) {
  if (gameIntroPages[lessonId]) {
    const pages = gameIntroPages[lessonId].map(p => ({ ...p, src: F.intro }));
    if (lessonId === 'g2d.input') {
      return [...pages, ...gameExplanationPages.input.slice(1).map(p => ({ ...p, src: F.visuals }))];
    }
    return pages;
  }
  const chapter = lessonId.replace(/^g2d\./, '');
  if (!gameExplanationPages[chapter]) return null;
  return gameExplanationPages[chapter].map((page, index) => {
    if (page.visual?.kind === 'flow' && gameConceptScenes[`${chapter}:${index}`]) {
      return { ...page, actors: gameConceptScenes[`${chapter}:${index}`], src: `${F.visuals} + ${F.scenes} (${chapter}:${index})` };
    }
    if (chapter === 'health' && index === 0) {
      return { ...page, text: 'Health przechowuje HP tej jednostki. damage(1) odejmuje jeden punkt: 5 → 4. Kontakt wykrywa collider; obrażenia zadaje osobny komponent.', code: undefined, src: `${F.visuals} + nadpisanie w ${F.jsx}` };
    }
    return { ...page, src: F.visuals };
  });
}

const esc = s => (s || '').replace(/\|/g, '\\|').replace(/\n+/g, ' ⏎ ');
const actorText = a => `${a.name}: ${a.state}${a.effect ? ` [${a.effect}]` : ''}`;

const out = [];
for (const chapter of courseManifest.chapters) {
  const key = chapter.id.slice(4);
  out.push(`\n## Lekcja ${chapter.order} — ${chapter.id} „${chapter.title}"`);
  out.push(`Definicja lekcji: ${F.manifest} → ${F.course} (track game-dev, order ${400 + chapter.order})`);
  out.push(`Scaffolding: ${chapter.scaffolding ?? `${defaultCourseScaffolding} (domyślne)`}`);
  out.push(`\n| Page | Tytuł | Treść | Miejsce w kodzie |`);
  out.push(`|---|---|---|---|`);
  const pages = conceptPages(chapter.id) || [];
  pages.forEach((p, i) => {
    const extras = [];
    if (p.code) extras.push(`kod: ${esc(typeof p.code === 'object' ? p.code.java : p.code)}`);
    if (p.setupCode) extras.push(`setupCode: ${esc(p.setupCode)}`);
    if (p.result) extras.push(`efekt: ${esc(p.result)}`);
    if (p.codeContext) extras.push(`kontekst: ${esc(p.codeContext)}`);
    if (p.visual?.note) extras.push(`nota: ${esc(p.visual.note)}`);
    if (p.actors) extras.push(`scenka: ${p.actors.map(actorText).join(' / ')}`);
    out.push(`| ${i + 1} | ${esc(p.title)} | ${esc(p.text)}${extras.length ? '<br><br>' + extras.join('<br>') : ''} | ${p.src} |`);
  });
  const teaching = gameDevTeaching(key);
  const pointer = chapter.id === 'g2d.camera' ? ' + pointerTheory' : '';
  out.push(`| teoria | ${esc(teaching.theory[0].title)} | ${esc(teaching.theory[0].text)}${teaching.theory[0].code ? `<br><br>kod: ${esc(teaching.theory[0].code)}` : ''} | ${F.teaching} |`);
  if (chapter.id === 'g2d.camera') {
    out.push(`| teoria 2 | Wskaźnik i przyciski myszy | (pointerTheory — pełny tekst w pliku) | ${F.course} |`);
  }
  out.push(`| wskazówka | Zapamiętaj | ${esc(teaching.tips[0])} | ${F.teaching} |`);

  out.push(`\n### Zadania lekcji ${chapter.order}`);
  for (const task of chapter.tasks) {
    out.push(`\n**${task.id}** (${task.mode} / ${task.learningStage || '-'}) — ${task.title}`);
    out.push(`- Polecenie: ${task.prompt}`);
    out.push(`- Cel: ${task.objective}`);
    if (task.solutionExplanation) out.push(`- Wyjaśnienie rozwiązania: ${task.solutionExplanation}`);
    out.push(`- Kryteria (widok ucznia):`);
    for (const c of studentGameCriteria(task)) out.push(`  - ${c}`);
  }
}

writeFileSync('docs/gamedev-lekcje-tresc.md', `# Treść lekcji Game Dev (Java Lab) — zrzut ${new Date().toISOString().slice(0, 10)}\n\nLegenda:\n- wiersze \`1..N\` = strony paginowanego wyjaśnienia „ZOBACZ, JAK TO DZIAŁA" (to widzi uczeń w lekcji),\n- wiersz \`teoria\` = pole \`lesson.theory\` zapisane w obiekcie lekcji; pager go nie używa — wyświetlałaby je tylko ścieżka awaryjna \`SharedExplanation\` dla lekcji bez dedykowanych stron,\n- wiersz \`wskazówka\` = pole \`lesson.tips\`; od tej wersji renderuje się jako pasek „Zapamiętaj" pod pagerem wyjaśnień,\n- \`### Zadania\` = treść panelu zadań (polecenie, cel, wyjaśnienie rozwiązania, kryteria dla ucznia).\n- \`Scaffolding\` wyświetla się jako podpowiedź w TaskPanel; lekcje bez własnego tekstu dostają domyślne.\n` + out.join('\n') + '\n');
console.log(`OK: ${courseManifest.chapters.length} lekcji, ${out.length} wierszy`);
