import {javaQuizTemplates,javaCourseTemplates} from './javaQuizCatalog.js';
// Public metadata only. Reference implementations live in generator.js (server only).
export const GENERATOR_VERSION = '1';
export const templates = [
  ...javaQuizTemplates,
  ...javaCourseTemplates,
  {id:'html-card',appId:'www-lab',name:'HTML · semantyczna karta'},
  {id:'css-grid',appId:'www-lab',name:'CSS · siatka kart'},
  {id:'js-sum',appId:'www-lab',name:'JavaScript · obliczenia na tablicy'},
  {id:'js-filter',appId:'www-lab',name:'JavaScript · filtrowanie tablicy'},
  {id:'java-basics',appId:'java-lab',name:'Java · 1 · Podstawy Javy'},
  {id:'java-gamedev',appId:'java-lab',name:'Java · 2 · Game Dev'},
  {id:'sql-select',appId:'databases',name:'SQL · wybieranie i sortowanie'},
  {id:'sql-group',appId:'databases',name:'SQL · grupowanie i agregacja'},
];
