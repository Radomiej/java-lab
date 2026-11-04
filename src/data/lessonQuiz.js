import { javaConceptPages } from './javaConceptPages.js';
import { gameExplanationPages } from '../../shared/lab-game-v2/editor/lessonVisuals.js';
import {gameIntroPages} from '../../shared/lab-game-v2/editor/gameIntroPages.js';
// Index is an immutable quiz revision; bump it whenever quiz content changes so pending submissions keep their questions and keys.
export const lessonQuizRevision=()=>4;

export function lessonQuizPages(lesson,{revision=lessonQuizRevision(lesson)}={}) {
  if(revision>=1&&gameIntroPages[lesson.id])return gameIntroPages[lesson.id];
  return javaConceptPages[lesson.id] || gameExplanationPages[lesson.id.replace(/^g2d\./, '')] || [];
}

// Technical vocabulary for fill-in questions on concept pages without runnable results.
const QUIZ_TYPE_TERMS = ['CharacterController2D','CircleCollider2D','Collider2D','ShapeRenderer','TextRenderer','Projectile2D','ProgressBar','GameObject','Transform','Component','TileMap','Health','Weapon','XpOrb','Experience','Button','PlayerController','EnemyAI','ContactDamage','GameCanvas','HUD','Game','Sprite','Audio','DamageText'];
const QUIZ_API_TERMS = ['getDirection()','requireComponent','addComponent','createObject','setPosition','getComponent','screenToWorld','worldToScreen','isKeyPressed','isKeyDown','setWorldBounds','constrainToBounds','onCollision','onTrigger','onCreate','onUpdate','onDestroy','onDeath','setProgress','flipX','isTrigger','maxHits','detectionRange','gameObject'];
const QUIZ_WORD_TERMS = ['collider','trigger','kamera','delta','warstwa','seed','spawn','Wallet','Tween','tween','cooldown','pocisk','kierunek','focus','pauza','XP','HP','ekran','poziom'];
const QUIZ_TERMS = [...QUIZ_TYPE_TERMS, ...QUIZ_API_TERMS, ...QUIZ_WORD_TERMS];
const termPattern=term=>new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}${term.endsWith('()')?'':'\\b'}`);
const rotate=(pool,offset)=>pool.length?pool[((offset%pool.length)+pool.length)%pool.length]:undefined;
const takeDistractors=(candidates,answer)=>{
  const picked=[];
  for(const candidate of candidates){
    if(candidate&&candidate!==answer&&!picked.includes(candidate)&&candidate.length<220)picked.push(candidate);
    if(picked.length===2)break;
  }
  return picked;
};
// A plausible wrong prediction derived from the real result, so options differ per question.
function mutateResult(answer,index){
  if(typeof answer!=='string'||answer.length>120)return null;
  const numbers=[...answer.matchAll(/-?\d+/g)];
  if(numbers.length){
    const match=numbers[index%numbers.length];
    const value=parseInt(match[0],10);
    const next=value===0?1:(index%2?value-1:value+1);
    return answer.slice(0,match.index)+next+answer.slice(match.index+match[0].length);
  }
  if(/\btrue\b/.test(answer))return answer.replace(/\btrue\b/,'false');
  if(/\bfalse\b/.test(answer))return answer.replace(/\bfalse\b/,'true');
  return null;
}
function distractorsForResult(answer,pages,index,domainPages){
  const sameLesson=[...new Set(pages.map(item=>item.result))].filter(text=>text&&text!==answer);
  const domain=[...new Set(domainPages.map(item=>item.result))].filter(text=>text&&text!==answer&&!sameLesson.includes(text));
  return takeDistractors([mutateResult(answer,index),rotate(sameLesson,index),rotate(domain,index*2+1),rotate(sameLesson,index+1),rotate(domain,index*2+2)],answer);
}
function clozeFromText(page,index,domainTexts){
  const text=page.text||'';
  const present=QUIZ_TERMS.filter(term=>termPattern(term).test(text));
  if(!present.length)return null;
  const answer=present[index%present.length];
  const found=text.match(termPattern(answer));
  const blanked=found?text.slice(0,found.index)+'____'+text.slice(found.index+found[0].length):text;
  const kind=QUIZ_TYPE_TERMS.includes(answer)?QUIZ_TYPE_TERMS:QUIZ_API_TERMS.includes(answer)?QUIZ_API_TERMS:QUIZ_WORD_TERMS;
  const absent=[...new Set([...kind,...QUIZ_TERMS])].filter(term=>!present.includes(term));
  const distractors=takeDistractors([rotate(absent,index*2),rotate(absent,index*2+1),rotate(absent,index*2+3)],answer);
  return distractors.length===2?{answer,blanked,distractors}:null;
}
export function createLessonQuiz(lesson,{revision=lessonQuizRevision(lesson)}={}) {
  const pages = lessonQuizPages(lesson,{revision});
  const quizPages=lesson.id==='g2d.scene'&&revision>=1?[pages[2],pages[3],pages[5]]:pages.slice(0,3);
  return quizPages.map((page, index) => {
    const answer = page.result || page.text;
    let distractors;
    let cloze=null;
    if(revision>=4){
      if(page.result){
        const domainPages=lesson.id?.startsWith('g2d.')
          ?[...Object.values(gameExplanationPages),...Object.values(gameIntroPages)].flat()
          :Object.values(javaConceptPages).flat();
        distractors=distractorsForResult(answer,pages,index,domainPages);
      }else{
        const domainTexts=[...new Set((lesson.id?.startsWith('g2d.')
          ?[...Object.values(gameExplanationPages),...Object.values(gameIntroPages)].flat()
          :Object.values(javaConceptPages).flat()).map(item=>item.text))].filter(text=>text&&text!==answer);
        cloze=clozeFromText(page,index,domainTexts);
        distractors=cloze?cloze.distractors:takeDistractors([rotate(domainTexts,index*2),rotate(domainTexts,index*2+1),rotate(domainTexts,index*2+3),rotate(domainTexts,index*2+5)],answer);
      }
    }else if (revision >= 2) {
      const field = page.result ? 'result' : 'text';
      const domainPages = lesson.id?.startsWith('g2d.')
        ? [...Object.values(gameExplanationPages), ...Object.values(gameIntroPages)].flat()
        : Object.values(javaConceptPages).flat();
      const sameLesson = [...new Set(pages.filter(item => item !== page).map(item => item[field]))]
        .filter(text => text && text !== answer && text.length < 220);
      const domain = [...new Set(domainPages.map(item => item[field]))]
        .filter(text => text && text !== answer && text.length < 220 && !sameLesson.includes(text));
      distractors = [];
      for (const pool of [sameLesson, domain]) {
        for (let step = 0; step < pool.length && distractors.length < 2; step++) {
          const candidate = pool[(index * 2 + step) % pool.length];
          if (!distractors.includes(candidate)) distractors.push(candidate);
        }
      }
    } else {
      const other = Object.values({...javaConceptPages, ...gameExplanationPages}).flat()
        .map(item => item.result || item.text).filter(text => text && text !== answer);
      distractors = [...new Set(other)].filter(text => text.length < 220).slice(index * 2, index * 2 + 2);
    }
    const effectiveAnswer=cloze?cloze.answer:answer;
    const options = [effectiveAnswer, ...distractors];
    const seed = [...lesson.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const rotation = (index + seed) % options.length;
    const choices = options.slice(rotation).concat(options.slice(0, rotation));
    return {id: `${lesson.id}-quiz-${index + 1}`, title: page.title,
      prompt: cloze?'Które pojęcie uzupełnia ten opis?':(page.result ? 'Jaki jest efekt opisanego przykładu?' : 'Które wyjaśnienie pasuje do tego kroku lekcji?'),
      code: cloze?cloze.blanked:(page.result ? (typeof page.code === 'object' ? page.code.java : page.code) : ''),
      choices, correct: choices.indexOf(effectiveAnswer), explanation: page.text};
  });
}
