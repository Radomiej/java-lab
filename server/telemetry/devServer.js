import {createServer} from 'node:http';
import {createTelemetryHandlers} from './handlers.js';
import {createAssignmentHandlers} from '../assignments/handlers.js';
const handlers=createTelemetryHandlers();
const assignments=createAssignmentHandlers({appId:'java-lab'});
createServer((req,res)=>{
  const route={'/api/telemetry/session':handlers.session,'/api/telemetry/events':handlers.events,'/api/assignments':assignments.generate,'/api/submissions':assignments.submit}[req.url];
  if(route)return route(req,res);
  res.writeHead(404);res.end();
}).listen(5185,'127.0.0.1',()=>console.log('Synchronizacja sesji: http://127.0.0.1:5185'));
