import {generateJavaCourseTask} from './javaCourseAssignments.js';
import {generateJavaQuiz} from './javaQuizAssignments.js';
import {javaBasicsVariants,assembleBasicsTask} from './javaBasicsTasks.js';
import {javaGameDevVariants,assembleGameDevTask} from './javaGameDevTasks.js';
// SERVER ONLY: never import into the browser bundle.
import {templates,GENERATOR_VERSION} from './catalog.js';

function hash(text){let state=2166136261;for(const char of text)state=Math.imul(state^char.charCodeAt(0),16777619);return state>>>0;}
function rng(seed){let state=hash(seed);return ()=>{state=(state+0x6d2b79f5)|0;let n=Math.imul(state^(state>>>15),1|state);n^=n+Math.imul(n^(n>>>7),61|n);return ((n^(n>>>14))>>>0)/4294967296;};}
export function normalizeDescriptor(input={}){
  const {templateId,difficulty='standard',generatorVersion=GENERATOR_VERSION,index=0}=input;
  const seed=typeof input.seed==='string'?input.seed.trim():'';
  if(generatorVersion!==GENERATOR_VERSION||!templates.some(t=>t.id===templateId)||!['easy','standard','challenge'].includes(difficulty)||!seed||seed.length>80||!Number.isInteger(index)||index<0||index>9)throw Error('Nieprawidłowy szablon, wersja, seed lub poziom zadania.');
  return {generatorVersion,templateId,seed,difficulty,index};
}
const variantFamilies={
  'java-basics':{variants:javaBasicsVariants,assemble:assembleBasicsTask},
  'java-gamedev':{variants:javaGameDevVariants,assemble:assembleGameDevTask},
};
function generateVariantTask(descriptor){
  const {templateId,seed,difficulty,index}=descriptor,{variants,assemble}=variantFamilies[templateId];
  // Set-scoped shuffle: one seed fixes the variant order, so tasks 0..index of a
  // set never repeat, independent of the chosen difficulty or set length.
  const order=variants.map((_,i)=>i),shuffle=rng(`${templateId}|${seed}`);
  for(let i=order.length-1;i>0;i--){const j=Math.floor(shuffle()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  const random=rng(JSON.stringify(descriptor)),level=['easy','standard','challenge'].indexOf(difficulty);
  const task=assemble(variants[order[index]],{level,int:(min,max)=>min+Math.floor(random()*(max-min+1)),pick:list=>list[Math.floor(random()*list.length)]});
  return {...descriptor,...task,id:`${templateId}-v1-${hash(JSON.stringify(descriptor)).toString(16)}${hash('identity:'+JSON.stringify(descriptor)).toString(16)}`};
}
export function generateAssignment(input){
  const descriptor=normalizeDescriptor(input),{templateId,seed,difficulty,index}=descriptor;
  if(templateId.startsWith('java-course-'))return generateJavaCourseTask(descriptor);
  if(templateId.startsWith('java-quiz-'))return generateJavaQuiz(descriptor);
  if(variantFamilies[templateId])return generateVariantTask(descriptor);
  // Independent per-task stream: changing set length does not alter earlier tasks.
  const random=rng(JSON.stringify(descriptor));const int=(min,max)=>min+Math.floor(random()*(max-min+1));
  const level=['easy','standard','challenge'].indexOf(difficulty),threshold=int(5,15);
  const values=Array.from({length:[6,10,14][level]},()=>int(-9,40));
  values.splice(0,4,threshold-1,threshold,threshold+1,threshold);
  const name=['Atlas','Latarnia','Kompas','Przystań'][int(0,3)],params={};
  let title,prompt,criteria,starterFiles,referenceFiles;
  if(['js-sum','js-filter'].includes(templateId)){
    const filter=templateId==='js-filter';
    const condition=level===0?'true':`value >= ${threshold}${level===2?' && value % 2 == 0':''}`;
    const selection=level===0?'wszystkie wartości':`wartości większe lub równe ${threshold}${level===2?' i jednocześnie parzyste':''}`;
    Object.assign(params,{values,threshold,selection:level});
    title=filter?'Wybierz elementy tablicy':'Suma wybranych elementów';
    prompt=`Napisz funkcję solve(values). ${filter?'Zwróć nową tablicę zawierającą':'Zwróć sumę obejmującą'} ${selection}. ${filter?'Zachowaj kolejność i duplikaty; nie zmieniaj wejścia.':'Dla braku pasujących elementów zwróć 0.'} Dla pustej tablicy zwróć ${filter?'[]':'0'}. Wejście nie jest null; zawiera do 1000 liczb całkowitych z zakresu -1000…1000. Przykładowe dane: ${JSON.stringify(values)}. W #result pokaż wynik solve dla tych danych jako JSON.`;
    criteria=['Rozwiązanie działa dla dowolnych danych zgodnych z opisem, nie tylko przykładu.',`${level?'Granica progu jest włączona; ':''}obsłuż duplikaty i pustą tablicę.`,filter?'Nie modyfikuj tablicy wejściowej.':'Nie wypisuj wyników pośrednich.'];
    const boot=`\nconst example = ${JSON.stringify(values)};\ndocument.querySelector('#result').textContent = JSON.stringify(solve(example));\n`;
    starterFiles={'index.html':'<!doctype html><html lang="pl"><head><meta charset="UTF-8"><title>Algorytm</title></head><body><h1>Wynik</h1><output id="result"></output><script src="script.js"></script></body></html>','script.js':`function solve(values) {\n  // TODO\n  return ${filter?'[]':'0'};\n}\n${boot}`};
    const body=filter?`const result = [];\n  for (const value of values) if (${condition}) result.push(value);\n  return result;`:`let total = 0;\n  for (const value of values) if (${condition}) total += value;\n  return total;`;
    referenceFiles={...starterFiles,'script.js':`function solve(values) {\n  ${body}\n}\n${boot}`};
  }else if(templateId==='html-card'){
    const items=['Mapa','Latarka','Notes'].slice(0,level+1);Object.assign(params,{name,items});
    title=`Karta projektu ${name}`;
    prompt=`Zbuduj dokument HTML po polsku z kodowaniem UTF-8 i title „${name}”. W main umieść article#project, wewnątrz h1 „${name}”, akapit „Projekt uczniowski” oraz listę ul z pozycjami ${items.map(x=>`„${x}”`).join(', ')} w podanej kolejności.${level?' Dodaj link „Kontakt” do #kontakt i sekcję section#kontakt z nagłówkiem h2 „Kontakt”.':''}${level===2?' W sekcji kontaktowej dodaj formularz: label „E-mail” połączony z input#email o type=email, name=email i required, oraz button typu submit z tekstem „Wyślij”.':''}`;
    criteria=['Dokument ma wymaganą strukturę, język, kodowanie i tytuł.','Teksty, kolejność i zagnieżdżenia odpowiadają poleceniu.','Elementy formularza i linki mają poprawne powiązania, jeśli są wymagane.'];
    starterFiles={'index.html':'<!doctype html>\n<html lang="pl">\n<head><meta charset="UTF-8"><title>TODO</title></head>\n<body>\n<!-- TODO: karta projektu -->\n</body>\n</html>'};
    referenceFiles={'index.html':`<!doctype html><html lang="pl"><head><meta charset="UTF-8"><title>${name}</title></head><body><main><article id="project"><h1>${name}</h1><p>Projekt uczniowski</p><ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul>${level?'<a href="#kontakt">Kontakt</a>':''}</article>${level?`<section id="kontakt"><h2>Kontakt</h2>${level===2?'<form><label for="email">E-mail</label><input id="email" name="email" type="email" required><button type="submit">Wyślij</button></form>':''}</section>`:''}</main></body></html>`};
  }else if(templateId==='css-grid'){
    const columns=int(2,3),gap=[12,16,20][int(0,2)],padding=[12,16,24][int(0,2)];Object.assign(params,{columns,gap,padding});
    title='Responsywna siatka kart';
    prompt=`W style.css ustaw .cards jako grid z ${columns} równymi kolumnami (minmax(0, 1fr)), odstępem ${gap}px i paddingiem ${padding}px. .card ma box-sizing: border-box i obramowanie 2px solid #334155.${level?' Dla szerokości viewportu do 600px włącznie ustaw jedną kolumnę.':''}${level===2?' .card:focus-within ma outline 3px solid #2563eb z offsetem 2px.':''} Zachowaj treść HTML; strona nie może przewijać się poziomo.`;
    criteria=['Liczba kolumn i odstępy są zgodne z poleceniem.','Reguły dotyczą wskazanych klas, bez zmieniania HTML.','Obsłuż dokładnie granicę 600px, jeśli wymagana.'];
    starterFiles={'index.html':`<!doctype html><html lang="pl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Karty</title><link rel="stylesheet" href="style.css"></head><body><main class="cards">${Array.from({length:6},(_,i)=>`<article class="card"><h2>Karta ${i+1}</h2><a href="#">Szczegóły</a></article>`).join('')}</main></body></html>`,'style.css':'/* TODO: układ kart */\n'};
    referenceFiles={...starterFiles,'style.css':`.cards { display: grid; grid-template-columns: repeat(${columns}, minmax(0, 1fr)); gap: ${gap}px; padding: ${padding}px; }\n.card { box-sizing: border-box; border: 2px solid #334155; min-width: 0; overflow-wrap: anywhere; }\n${level?'@media (max-width: 600px) { .cards { grid-template-columns: minmax(0, 1fr); } }\n':''}${level===2?'.card:focus-within { outline: 3px solid #2563eb; outline-offset: 2px; }\n':''}`};
  }else{
    const rows=Array.from({length:[12,24,36][level]},(_,i)=>({id:i+1,name:`Produkt ${i+1}`,category:['Dom','Biuro','Sport'][i%3],price:i<3?threshold-1+i:int(1,40),quantity:1+i%5}));
    if(templateId==='sql-group'&&level===2){
      // Exactly 1/2/3 qualifying rows per category. HAVING must reject one group
      // for every seed, while values and quantities still vary reproducibly.
      rows.forEach((row,i)=>{row.price=Math.floor(i/3)<1+i%3?threshold+int(0,20):int(1,threshold-1);});
    }
    const seedSql=`CREATE TABLE produkty (id INTEGER PRIMARY KEY, nazwa TEXT NOT NULL, kategoria TEXT NOT NULL, cena INTEGER NOT NULL, ilosc INTEGER NOT NULL);\nINSERT INTO produkty VALUES ${rows.map(r=>`(${r.id},'${r.name}','${r.category}',${r.price},${r.quantity})`).join(',\n')};`;
    Object.assign(params,{threshold,seedSql});let sql;
    if(templateId==='sql-select'){
      title='Wybierz produkty';
      prompt=`Z tabeli produkty wybierz kolumny id, nazwa, cena (w tej kolejności) dla ceny co najmniej ${threshold}${level?' i ilosc co najmniej 2':''}. Posortuj według cena ${level===2?'malejąco':'rosnąco'}, a przy remisie według id rosnąco.${level===2?' Zwróć pierwsze 5 wierszy.':''} Użyj jednego SELECT.`;
      sql=`SELECT id, nazwa, cena FROM produkty WHERE cena >= ${threshold}${level?' AND ilosc >= 2':''} ORDER BY cena ${level===2?'DESC':'ASC'}, id ASC${level===2?' LIMIT 5':''};`;
    }else{
      title='Podsumowanie kategorii';
      prompt=`W tabeli produkty ${level?`najpierw pozostaw wiersze o cenie co najmniej ${threshold}, następnie `:''}pogrupuj wiersze według kategoria. Zwróć kategoria oraz COUNT(*) pod aliasem liczba${level===2?' i SUM(ilosc) pod aliasem suma_ilosci, pozostawiając wyłącznie grupy o COUNT(*) >= 2':''}. Zachowaj tę kolejność kolumn i sortuj według kategoria rosnąco. Użyj jednego SELECT.`;
      sql=`SELECT kategoria, COUNT(*) AS liczba${level===2?', SUM(ilosc) AS suma_ilosci':''} FROM produkty${level?` WHERE cena >= ${threshold}`:''} GROUP BY kategoria${level===2?' HAVING COUNT(*) >= 2':''} ORDER BY kategoria ASC;`;
    }
    criteria=['Wynik ma wymagane kolumny i aliasy w podanej kolejności.','Warunki obejmują wskazane granice i wymagane sortowanie.','Nie zmieniaj schematu ani danych; oddaj zapytanie w answer.sql.'];
    starterFiles={'answer.sql':'-- TODO: napisz jedno zapytanie SELECT\n'};referenceFiles={'answer.sql':sql};
  }
  return {...descriptor,id:`${templateId}-v1-${hash(JSON.stringify(descriptor)).toString(16)}${hash('identity:'+JSON.stringify(descriptor)).toString(16)}`,title,prompt,criteria,starterFiles,referenceFiles,params};
}
export function publicAssignment(assignment){const {referenceFiles,...publicTask}=assignment;return publicTask;}
