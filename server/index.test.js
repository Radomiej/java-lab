// @vitest-environment node
import {it,expect} from 'vitest';
import {createTutorServer} from './index.js';
import {readTutorStream} from '../shared/lab-game-v2/tutorStream.js';
it('delivers live HTTP text before the handler finishes',async()=>{
 let finish;const gate=new Promise(resolve=>{finish=resolve;});
 const server=createTutorServer({handler:async(_payload,_signal,emit)=>{emit({type:'delta',text:'Kamera'});await gate;return {status:200,body:{message:'Kamera gotowa',proposals:[]}};}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const response=await fetch(`http://127.0.0.1:${server.address().port}/api/ai/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({stream:true})});
  const events=[];const result=readTutorStream(response,event=>{events.push(event);if(event.type==='delta')finish();});
  expect((await result).message).toBe('Kamera gotowa');expect(events).toContainEqual({type:'delta',text:'Kamera'});
 }finally{finish();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
it('enforces origins, body limits and rate limits with JSON errors, without provider calls',async()=>{
  const server=createTutorServer({apiKey:'',loadModels:async()=>({configured:false,models:[]}),handler:async()=>({status:200,body:{message:'OK',proposals:[]}})});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
  try{
    expect((await fetch(base+'/api/ai/config',{headers:{Origin:'http://evil.example'}})).status).toBe(403);
    expect(await(await fetch(base+'/api/ai/config')).json()).toEqual({configured:false,models:[]});
    const post=body=>fetch(base+'/api/ai/chat',{method:'POST',headers:{'Content-Type':'application/json'},body});
    expect((await post('{bad')).status).toBe(400);expect((await post('x'.repeat(262145))).status).toBe(413);
    for(let i=0;i<8;i++)expect((await post('{}')).status).toBe(200);
    expect((await post('{}')).status).toBe(429);
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
