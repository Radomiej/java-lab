import {gameEngineRuntimeFiles} from '../data/gameEngineRuntime.js';
import {engineGuide} from '../data/engineGuide.js';
import {parseJavaApi,apiMembers,callContext} from '../../shared/lab-game-v2/editor/apiSyntax.js';
export const engineApiCatalog=parseJavaApi(gameEngineRuntimeFiles);
const docs=new Map(engineGuide.map(item=>[item.name,item]));
function ownerOf(source,prefix) {
  const chain=prefix.trimEnd();
  const special={input:'InputManager',physics:'Physics2D',random:'Random',canvas:'Canvas',time:'Time',transform:'Transform',scale:'Vector2',visualOffset:'Vector2',gameObject:'GameObject'};
  const last=chain.match(/([\w$]+)\.$/)?.[1];
  if(special[last])return special[last];
  const component=chain.match(/(?:requireComponent|getComponent)\(\s*(\w+)\.class\s*\)\.$/)?.[1];
  if(component)return component;
  if(/getGame\(\)\.$/.test(chain))return 'Game';
  if(last && engineApiCatalog[last])return last;
  if(last && last!=='this')return source.match(new RegExp(`\\b(\\w+)\\s+${last}\\b`))?.[1];
  return source.match(/\bclass\s+\w+\s+extends\s+(\w+)/)?.[1];
}
const paramName=parameter=>parameter.trim().split(/\s+/).at(-1).replace(/\.\.\./g,'');
const snippet=member=>`${member.name}(${(member.parameters??[]).map((p,i)=>'${'+(i+1)+':'+paramName(p)+'}').join(', ')})`;
function documentation(owner){const item=docs.get(owner);return {value:`${item?.description??'Publiczne API silnika.'}${item?.example?'\n\n```java\n'+item.example+'\n```':''}`};}
export function createEngineCompletionProvider(monaco,ownsModel=()=>true) {
  return {triggerCharacters:['.',' '],provideCompletionItems(model,position) {
    if(!ownsModel(model))return {suggestions:[]};
    const word=model.getWordUntilPosition(position),source=model.getValue().slice(0,model.getOffsetAt(position));
    const prefix=source.slice(0,source.length-word.word.length),owner=ownerOf(source,prefix),constructing=/\bnew\s+$/.test(prefix);
    const members=constructing?Object.keys(engineApiCatalog).filter(name=>engineApiCatalog[name].constructible).map(name=>({name,kind:'constructor',parameters:engineApiCatalog[name].members.find(m=>m.kind==='constructor')?.parameters??[]})):apiMembers(engineApiCatalog,owner).filter(m=>m.kind!=='constructor');
    const all=/\.$/.test(prefix)||constructing?members:[...members,...Object.keys(engineApiCatalog).map(name=>({name,kind:'class'}))];
    const seen=new Set();
    return {suggestions:all.filter(m=>m.name.toLowerCase().startsWith(word.word.toLowerCase())).filter(m=>{const key=m.signature??m.name;if(seen.has(key))return false;seen.add(key);return true;}).map(m=>({
      label:m.name,detail:m.signature??m.name,documentation:documentation(m.kind==='constructor'||m.kind==='class'?m.name:owner),
      kind:monaco.languages.CompletionItemKind[m.kind==='field'?'Field':m.kind==='class'?'Class':m.kind==='constructor'?'Constructor':'Method'],
      insertText:m.parameters?snippet(m):m.name,insertTextRules:monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range:{startLineNumber:position.lineNumber,endLineNumber:position.lineNumber,startColumn:word.startColumn,endColumn:word.endColumn},
    }))};
  }};
}
export function createEngineSignatureProvider(ownsModel=()=>true) {
  return {signatureHelpTriggerCharacters:['(', ','],signatureHelpRetriggerCharacters:[')'],provideSignatureHelp(model,position) {
    if(!ownsModel(model))return null;
    const source=model.getValue().slice(0,model.getOffsetAt(position)),call=callContext(source);if(!call)return null;
    const constructing=/\bnew\s+$/.test(call.prefix),owner=constructing?call.name:ownerOf(source,call.prefix);
    const members=apiMembers(engineApiCatalog,owner).filter(m=>m.name===call.name&&m.parameters);
    if(!members.length)return null;
    const activeSignature=Math.max(0,members.findIndex(m=>m.parameters.length>call.argument));
    return {value:{signatures:members.map(m=>({label:m.signature,documentation:documentation(owner),parameters:m.parameters.map(label=>({label}))})),activeSignature,activeParameter:call.argument},dispose(){}};
  }};
}
