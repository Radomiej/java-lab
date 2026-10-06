// @vitest-environment node
import {it,expect} from 'vitest';
import {createTutorServer} from './index.js';
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
