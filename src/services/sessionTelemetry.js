import {getInstallationId,newId} from './installationId.js';
import {validateEvent,MAX_EVENT_BYTES} from '../../shared/telemetry/schema.js';
export function createSessionTelemetry({fetchImpl=(...args)=>fetch(...args),getSnapshot,onStatus=()=>{},documentRef=globalThis.document,enabled=false,machineId=getInstallationId()}={}) {
  const sessionId=newId();let sequence=0,queue=[],running=false,busy=false,token=null,expiresAt=0,retry=null,debounce=null,maxWait=null,heartbeat=null,backoff=2000,controller;
  const status=s=>{try{onStatus(s);}catch{}};
  const request=async(url,body,headers={})=>{
    controller=new AbortController();let timer;
    const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{controller?.abort();reject(new Error('Timeout'));},8000);});
    try{return await Promise.race([Promise.resolve().then(async()=>{const response=await fetchImpl(url,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body),signal:controller.signal});if(url.endsWith('/session')&&response.ok)return {ok:true,session:await response.json()};return response;}),timeout]);}finally{clearTimeout(timer);}
  };
  const enqueue=type=>{
    if(!running)return;
    try{
      const snapshot={...getSnapshot(),visibility:documentRef?.visibilityState==='hidden'?'hidden':'visible'};
      const event={version:1,eventId:newId(),machineId,sessionId,sequence:++sequence,type,sentAt:Date.now(),snapshot};
      if(new TextEncoder().encode(JSON.stringify(event)).length>MAX_EVENT_BYTES){status('too_large');return;}
      validateEvent(event);
      // Keep the in-flight event immutable for idempotent retries; coalesce all unsent snapshots.
      if(type==='snapshot'||type==='heartbeat')queue=queue.filter((e,i)=>i===0&&busy || !['snapshot','heartbeat'].includes(e.type));
      queue.push(event);
      if(queue.length>20)queue.splice(busy?1:0,queue.length-20);
      void flush();
    }catch{status('offline');}
  };
  async function flush(){
    if(!running||busy||retry||!queue.length)return;
    busy=true;const event=queue[0];
    try{
      if(!token || expiresAt<Date.now()+60000){
        const response=await request('/api/telemetry/session',{machineId,sessionId});
        if(!response.ok)throw new Error('Session');const data=response.session;
        if(typeof data.token!=='string'||!Number.isFinite(data.expiresAt))throw new Error('Session');
        token=data.token;expiresAt=data.expiresAt;
      }
      if(!running)return;
      const response=await request('/api/telemetry/events',event,{Authorization:`Bearer ${token}`});
      if(response.status===401){token=null;throw new Error('Token');}
      if(!response.ok)throw new Error('Publish');
      if(queue[0]===event)queue.shift();backoff=2000;status('online');
    }catch{
      if(running){status('offline');retry=setTimeout(()=>{retry=null;enqueue('snapshot');void flush();},backoff);backoff=Math.min(30000,backoff*2);}
    }finally{busy=false;if(running&&!retry)void flush();}
  }
  const cancelDebounce=()=>{clearTimeout(debounce);clearTimeout(maxWait);debounce=null;maxWait=null;};
  const publishChange=()=>{cancelDebounce();enqueue('snapshot');};
  const online=()=>{if(!running)return;clearTimeout(retry);retry=null;enqueue('snapshot');};
  const visibility=()=>enqueue('heartbeat');
  return {
    machineId,sessionId,pendingCount:()=>queue.length,
    start(){if(running||!enabled){status(enabled?'offline':'disabled');return;}running=true;status('connecting');enqueue('session_started');heartbeat=setInterval(()=>enqueue('heartbeat'),15000);globalThis.addEventListener?.('online',online);documentRef?.addEventListener('visibilitychange',visibility);},
    changed(type='snapshot'){if(!running)return;if(type!=='snapshot'){cancelDebounce();enqueue(type);return;}clearTimeout(debounce);debounce=setTimeout(publishChange,2000);maxWait ??= setTimeout(publishChange,5000);},
    stop(){running=false;cancelDebounce();clearTimeout(retry);clearInterval(heartbeat);retry=null;controller?.abort();queue=[];globalThis.removeEventListener?.('online',online);documentRef?.removeEventListener('visibilitychange',visibility);},
  };
}
