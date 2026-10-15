import {useEffect,useRef,useState,useCallback} from 'react';
import {getInstallationId} from '../services/installationId.js';
import {createSessionTelemetry} from '../services/sessionTelemetry.js';
export function useSessionTelemetry(snapshot){
  const latest=useRef(snapshot);latest.current=snapshot;
  const client=useRef(null);
  const previous=useRef(null);
  const [machineId]=useState(()=>getInstallationId());
  const [status,setStatus]=useState('disabled');
  useEffect(()=>{
    const sender=createSessionTelemetry({machineId,enabled:import.meta.env.VITE_TELEMETRY_ENABLED==='true',getSnapshot:()=>latest.current,onStatus:setStatus});
    client.current=sender;sender.start();
    return ()=>{client.current=null;sender.stop();};
  },[machineId]);
  useEffect(()=>{const old=previous.current;if(old&&(old.lessonId!==snapshot.lessonId||old.taskId!==snapshot.taskId)){client.current?.changed('task_left',old);client.current?.changed('snapshot',snapshot);}previous.current=snapshot;});
  const capture=useCallback((type,value)=>client.current?.changed(type,value),[]);
  return {machineId,status,capture};
}
