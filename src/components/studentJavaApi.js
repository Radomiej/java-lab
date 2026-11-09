export function maskJava(source) {
  return source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,text=>text.replace(/[^\n]/g,' '));
}
function closeBrace(source,start) {
  let depth=1;
  for(let i=start+1;i<source.length;i++){if(source[i]==='{')depth++;if(source[i]==='}'&&!--depth)return i;}
  return source.length;
}
export function studentJavaApi(files) {
  const catalog={};
  for(const [file,source] of Object.entries(files)) {
    const masked=maskJava(source);
    for(const cls of masked.matchAll(/\b(class|interface)\s+(\w+)(?:\s+extends\s+(\w+))?[^{}]*\{/g)) {
      const start=cls.index+cls[0].length,end=closeBrace(masked,start-1),members=[];
      let headerStart=start;
      for(let i=start;i<end;i++) {
        if(masked[i]!=='{'&&masked[i]!==';')continue;
        const header=masked.slice(headerStart,i).replace(/@\w+(?:\([^)]*\))?/g,'').trim();
        const method=header.match(/^(?:(?:public|private|protected|static|final|abstract|synchronized|default)\s+)*(?:([\w<>?,.\[\]]+)\s+)?(\w+)\s*\(([^()]*)\)(?:\s+throws\s+[\w., ]+)?$/);
        if(method)members.push({name:method[2],type:method[1]||cls[2],parameters:method[3].split(',').map(p=>p.trim()).filter(Boolean),kind:method[2]===cls[2]?'constructor':'method',signature:header,private:/\bprivate\b/.test(header),static:/\bstatic\b/.test(header),offset:headerStart});
        else {
          const field=header.match(/^(?:(?:public|private|protected|static|final|volatile|transient)\s+)*([\w<>?,.\[\]]+)\s+(\w+)\s*(?:=[\s\S]*)?$/);
          if(field)members.push({name:field[2],type:field[1],kind:'field',signature:header.split('=')[0].trim(),private:/\bprivate\b/.test(header),static:/\bstatic\b/.test(header),offset:headerStart});
        }
        if(masked[i]==='{')i=closeBrace(masked,i);
        headerStart=i+1;
      }
      catalog[cls[2]]={name:cls[2],parent:cls[3],file,start:cls.index,end,members};
    }
  }
  return catalog;
}
export function studentMembers(catalog,owner,includePrivate=false) {
  const members=[],visited=new Set();
  while(catalog[owner]&&!visited.has(owner)) {
    visited.add(owner);members.push(...catalog[owner].members.filter(m=>m.kind!=='constructor'&&(!m.private||includePrivate)));
    owner=catalog[owner].parent;includePrivate=false;
  }
  return members;
}
const LOCAL_TYPE = /\b(?:final\s+)?((?:int|long|double|float|boolean|char|byte|short|String|var|[A-Z][\w$]*)(?:<[\w$?, <>]*>)?(?:\[\])*)\s+([a-zA-Z_$][\w$]*)\s*(?=[=;,):\[])/g;
const NOT_PARAM_OWNER = new Set(['if','for','while','catch','switch','synchronized','try','new','return','throw','assert','case','do','else']);

// Zmienne i parametry widoczne w miejscu kursora.
// masked = maskJava tekstu PRZED kursorem (bez dopisywanego słowa).
export function localVariables(masked) {
  const n = masked.length;
  const brace = new Int32Array(n + 1), paren = new Int32Array(n + 1);
  for (let i = 0, b = 0, p = 0; i < n; i++) {
    const c = masked[i];
    if (c === '{') b++; else if (c === '}') b--;
    if (c === '(') p++; else if (c === ')') p--;
    brace[i + 1] = b; paren[i + 1] = p;
  }
  const parenEnd = (from, level) => {
    for (let d = paren[from], i = from; i < n; i++) {
      if (masked[i] === '(') d++;
      else if (masked[i] === ')' && --d < level) return i;
    }
    return n;
  };
  const locals = new Map();
  for (const m of masked.matchAll(LOCAL_TYPE)) {
    const d = m.index;
    let scopeEnd = n, param = false;
    if (paren[d] > 0) {
      // Deklaracja w nagłówku (parametr metody, zmienna pętli/catch):
      // zasięg = blok {} albo pojedyncza instrukcja po zamykającym ')'.
      const close = parenEnd(d, paren[d]);
      let j = close + 1; while (masked[j] === ' ') j++;
      const stmtEnd = masked.indexOf(';', j);
      scopeEnd = masked[j] === '{' ? closeBrace(masked, j) : (stmtEnd === -1 ? n : stmtEnd + 1);
      let o = d; while (o > 0 && !(masked[o] === '(' && paren[o] === paren[d] - 1)) o--;
      const owner = masked.slice(0, o).match(/([\w$]+)\s*$/)?.[1];
      param = !!owner && !NOT_PARAM_OWNER.has(owner);
    } else {
      // Zwykła deklaracja — zasięg kończy się z zamknięciem jej bloku {}.
      for (let j = d + 1; j <= n; j++) if (brace[j] < brace[d]) { scopeEnd = j; break; }
    }
    if (scopeEnd >= n) locals.set(m[2], { name: m[2], type: m[1], param });
  }
  return [...locals.values()];
}

export function studentCompletionItems(files,source,prefix) {
  const catalog=studentJavaApi({...files,'__active.java':source}),masked=maskJava(prefix);
  const receiver=masked.match(/(\w+)\s*\.\s*$/)?.[1];
  let owner=masked.match(/(?:requireComponent|getComponent)\(\s*(\w+)\.class\s*\)\.\s*$/)?.[1];
  const items=members=>members.map(m=>({label:m.name,type:m.kind==='field'?'variable':'method',detail:m.signature,
    insertText:m.kind==='method'?`${m.name}(${m.parameters.map((p,i)=>'${'+(i+1)+':'+p.split(/\s+/).at(-1)+'}').join(', ')})`:m.name,snippet:m.kind==='method'}));
  const currentClass=Object.values(catalog).find(c=>c.file==='__active.java'&&c.start<=prefix.length&&c.end>=prefix.length)?.name;
  const locals=localVariables(masked);
  if(!receiver&&!owner){
    const localNames=new Set(locals.map(v=>v.name));
    return [
      ...locals.map(v=>({label:v.name,type:'variable',detail:v.param?`Parametr · ${v.type}`:`Zmienna · ${v.type}`,insertText:v.name})),
      ...Object.keys(catalog).map(label=>({label,type:'class',detail:`Klasa projektu · ${catalog[label].file}`,insertText:label})),
      ...(/\bnew\s+$/.test(masked)?[]:items(studentMembers(catalog,currentClass,true)).filter(it=>!localNames.has(it.label))),
    ];
  }
  if(receiver==='this')owner=currentClass;
  else if(receiver){
    const local=[...locals].reverse().find(v=>v.name===receiver);
    if(local){
      if(/\[\]/.test(local.type))return [{label:'length',type:'variable',detail:'Długość tablicy',insertText:'length'}];
      owner=local.type.replace(/<[\s\S]*?>/,'').replace(/\[\]*/g,'');
    }
    else if(catalog[receiver])owner=receiver;
    else owner=[...masked.matchAll(new RegExp(`\\b([\\w$]+)(?:<[^;{}]+>)?\\s+${receiver}\\s*(?=[=;,):\\[])`,'g'))].filter(m=>!new Set(['return','throw','new','case','yield','instanceof','extends','implements','class','interface']).has(m[1])).at(-1)?.[1];
  }
  return items(studentMembers(catalog,owner,receiver==='this').filter(m=>!catalog[receiver]||m.static));
}
