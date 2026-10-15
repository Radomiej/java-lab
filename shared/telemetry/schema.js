export const MAX_EVENT_BYTES = 256 * 1024;
export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function validateEvent(value) {
  const fail = () => { throw new Error('Nieprawidłowe zdarzenie sesji.'); };
  if (!value || new TextEncoder().encode(JSON.stringify(value)).length > MAX_EVENT_BYTES) fail();
  const {version,eventId,machineId,sessionId,sequence,type,sentAt,snapshot:s} = value;
  if (version !== 1 || ![eventId,machineId,sessionId].every(id=>typeof id==='string'&&uuidPattern.test(id)) || !Number.isSafeInteger(sequence) || sequence<1 || !Number.isSafeInteger(sentAt) || sentAt<0 || !['session_started','snapshot','heartbeat','run_result'].includes(type)) fail();
  if (!s || !s.files || typeof s.files !== 'object' || Array.isArray(s.files)) fail();
  const string = (v,max) => {if(typeof v!=='string'||v.length>max)fail(); return v;};
  const files=Object.create(null), entries=Object.entries(s.files);
  if(entries.length>100)fail();
  for(const [path,code] of entries){if(!path || path.length>200 || path.startsWith('/') || path.includes('..') || path.includes('\\') || ['__proto__','prototype','constructor'].includes(path))fail();files[path]=string(code,MAX_EVENT_BYTES);}
  if(!['visible','hidden'].includes(s.visibility)||![true,false,null].includes(s.passed))fail();
  return {version,eventId,machineId,sessionId,sequence,type,sentAt,snapshot:{lessonId:string(s.lessonId,200),lessonTitle:string(s.lessonTitle,500),taskId:string(s.taskId,200),activeFile:string(s.activeFile,200),files,runnerStatus:string(s.runnerStatus,40),output:string(s.output,20000),passed:s.passed,visibility:s.visibility}};
}
