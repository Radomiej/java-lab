// @vitest-environment node
import {it,expect} from 'vitest';
import {readProviderCompletion,readTutorStream} from '../shared/lab-game-v2/tutorStream.js';
const response=text=>new Response(new ReadableStream({start(controller){const bytes=new TextEncoder().encode(text);for(let i=0;i<bytes.length;i+=3)controller.enqueue(bytes.slice(i,i+3));controller.close();}}),{headers:{'Content-Type':'text/event-stream'}});
it('streams Unicode deltas, skips heartbeats and assembles tool calls only at completion',async()=>{
 const events=[];
 const frames=[{choices:[{delta:{content:'Zażółć'}}]},{choices:[{delta:{tool_calls:[{index:0,id:'call',function:{name:'propose_project_',arguments:'{"message":"ok",'}}]}}]},{choices:[{delta:{tool_calls:[{index:0,function:{name:'files',arguments:'"proposals":[]}'}}]}}]}];
 const result=await readProviderCompletion(response(': waiting\r\n\r\n'+frames.map(frame=>'data: '+JSON.stringify(frame)+'\r\n\r\n').join('')+'data: [DONE]\r\n\r\n'),event=>events.push(event));
 expect(events[0]).toEqual({type:'delta',text:'Zażółć'});
 expect(result.choices[0].message.tool_calls[0].function).toEqual({name:'propose_project_files',arguments:'{"message":"ok","proposals":[]}'});
});
it('rejects truncated streams and errors after partial text',async()=>{
 await expect(readProviderCompletion(response('data: {"choices":[{"delta":{"content":"partial"}}]}\n\n'))).rejects.toThrow('przed ukończeniem');
 await expect(readProviderCompletion(response('data: {"error":{"message":"secret provider details"}}\n\n'))).rejects.toThrow('Dostawca przerwał');
});
it('delivers live events before the final answer and rejects missing completion',async()=>{
 const events=[];
 const result=await readTutorStream(response('data: {"type":"delta","text":"Kamera"}\n\ndata: {"type":"done","message":"Kamera","proposals":[]}\n\n'),event=>events.push(event));
 expect(events).toEqual([{type:'delta',text:'Kamera'}]);expect(result.message).toBe('Kamera');
 await expect(readTutorStream(response('data: {"type":"delta","text":"partial"}\n\n'))).rejects.toThrow('nie została ukończona');
});
