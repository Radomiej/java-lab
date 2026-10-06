import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { createTutorHandler } from './tutor.js';
import { listFreeOpenRouterModels } from './freeModels.js';

export function createTutorServer({apiKey=process.env.OPENROUTER_API_KEY,handler=createTutorHandler({apiKey}),loadModels=listFreeOpenRouterModels,now=Date.now}={}){
  const requests=new Map();let active=0;
  const send=(res,status,body)=>{if(res.destroyed||res.headersSent)return;res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(body));};
  const server=createServer(async(req,res)=>{
    const port=server.address()?.port;
    if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(req.headers.host)||(req.headers.origin&&!['http://127.0.0.1:5182','http://localhost:5182'].includes(req.headers.origin)))return send(res,403,{message:'Niedozwolone źródło zapytania.'});
    if(req.url==='/api/ai/config'&&req.method==='GET'){
      try{return send(res,200,await loadModels(fetch,apiKey));}catch{return send(res,502,{message:'Nie udało się pobrać darmowych modeli.'});}
    }
    if(req.url!=='/api/ai/chat'||req.method!=='POST')return send(res,404,{message:'Nie znaleziono endpointu.'});
    if(!req.headers['content-type']?.startsWith('application/json'))return send(res,415,{message:'Wymagany JSON.'});
    const time=now();for(const [address,times]of requests)if(times.every(t=>time-t>=60000))requests.delete(address);
    const address=req.socket.remoteAddress;const recent=(requests.get(address)||[]).filter(t=>time-t<60000);
    if(recent.length>=10||active>=2)return send(res,429,{message:'Zbyt wiele zapytań. Poczekaj chwilę.'});
    requests.set(address,[...recent,time]);active++;
    const controller=new AbortController();
    res.on('close',()=>{if(!res.writableEnded)controller.abort();});
    const timer=setTimeout(()=>{controller.abort();send(res,408,{message:'Przekroczono czas zapytania.'});},60000);
    try{
      const chunks=[];let size=0;
      for await(const chunk of req){size+=chunk.length;if(size>262144){send(res,413,{message:'Zapytanie jest zbyt duże.'});req.resume();return;}chunks.push(chunk);}
      let payload;try{payload=JSON.parse(Buffer.concat(chunks).toString());}catch{return send(res,400,{message:'Nieprawidłowy JSON.'});}
      const result=await handler(payload,controller.signal);send(res,result.status,result.body);
    }catch{send(res,400,{message:'Nie udało się odczytać zapytania.'});}finally{clearTimeout(timer);active--;}
  });
  server.requestTimeout=15000;server.headersTimeout=10000;
  return server;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const server=createTutorServer();
  server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'Port tutora 5184 jest zajęty.':'Nie udało się uruchomić tutora.');process.exitCode=1;});
  server.listen(5184,'127.0.0.1',()=>console.log('Tutor Java: http://127.0.0.1:5184'));
}
