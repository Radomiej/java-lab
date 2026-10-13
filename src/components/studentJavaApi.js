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
export function studentCompletionItems(files,source,prefix) {
  const catalog=studentJavaApi({...files,'__active.java':source}),masked=maskJava(prefix);
  const receiver=masked.match(/(\w+)\s*\.\s*$/)?.[1];
  let owner=masked.match(/(?:requireComponent|getComponent)\(\s*(\w+)\.class\s*\)\.\s*$/)?.[1];
  const items=members=>members.map(m=>({label:m.name,type:m.kind==='field'?'variable':'method',detail:m.signature,
    insertText:m.kind==='method'?`${m.name}(${m.parameters.map((p,i)=>'${'+(i+1)+':'+p.split(/\s+/).at(-1)+'}').join(', ')})`:m.name,snippet:m.kind==='method'}));
  const currentClass=Object.values(catalog).find(c=>c.file==='__active.java'&&c.start<=prefix.length&&c.end>=prefix.length)?.name;
  if(!receiver&&!owner)return [
    ...Object.keys(catalog).map(label=>({label,type:'class',detail:`Klasa projektu · ${catalog[label].file}`,insertText:label})),
    ...(/\bnew\s+$/.test(masked)?[]:items(studentMembers(catalog,currentClass,true))),
  ];
  if(receiver==='this')owner=Object.values(catalog).find(c=>c.file==='__active.java'&&c.start<=prefix.length&&c.end>=prefix.length)?.name;
  else if(catalog[receiver])owner=receiver;
  else if(receiver)owner=[...masked.matchAll(new RegExp(`\\b([\\w$]+)(?:<[^;{}]+>)?\\s+${receiver}\\s*(?=[=;,):\\[])`,'g'))].filter(m=>!new Set(['return','throw','new','case','yield','instanceof','extends','implements','class','interface']).has(m[1])).at(-1)?.[1];
  return items(studentMembers(catalog,owner,receiver==='this').filter(m=>!catalog[receiver]||m.static));
}
