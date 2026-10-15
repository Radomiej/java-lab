import {useEffect,useRef,useState} from 'react';
import {getInstallationId} from '../services/installationId.js';
import {createSessionTelemetry} from '../services/sessionTelemetry.js';
export function useSessionTelemetry(snapshot){
  const latest=useRef(snapshot);latest.current=snapshot;
  const client=useRef(null);
  const [machineId]=useState(()=>getInstallationId());
  const [status,setStatus]=useState('disabled');
  useEffect(()=>{
    const sender=createSessionTelemetry({machineId,enabled:import.meta.env.VITE_TELEMETRY_ENABLED==='true',getSnapshot:()=>latest.current,onStatus:setStatus});
    client.current=sender;sender.start();
    return ()=>{client.current=null;sender.stop();};
  },[machineId]);
  useEffect(()=>{client.current?.changed();},[snapshot.lessonId,snapshot.taskId,snapshot.activeFile,snapshot.files]);
  useEffect(()=>{client.current?.changed('run_result');},[snapshot.runnerStatus,snapshot.passed,snapshot.output]);
  return {machineId,status};
}
