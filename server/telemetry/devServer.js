import {createServer} from 'node:http';
import {createTelemetryHandlers} from './handlers.js';
const handlers=createTelemetryHandlers();
createServer((req,res)=>{
  const route={'/api/telemetry/session':handlers.session,'/api/telemetry/events':handlers.events}[req.url];
  if(route)return route(req,res);
  res.writeHead(404);res.end();
}).listen(5185,'127.0.0.1',()=>console.log('Synchronizacja sesji: http://127.0.0.1:5185'));
