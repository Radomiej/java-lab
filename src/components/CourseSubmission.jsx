import {useEffect,useRef,useState} from 'react';
import {createSubmissionClient} from '../services/assignmentSubmissions.js';
import {getInstallationId} from '../services/installationId.js';
export default function CourseSubmission({lesson,task,files,clientFactory=createSubmissionClient}){
  const [studentId,setStudentId]=useState(()=>{try{return JSON.parse(localStorage.getItem('java-lab-assignment-identity'))?.studentId||'';}catch{return '';}});
  const [rows,setRows]=useState([]),[id,setId]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const client=useRef(null);
  useEffect(()=>{const instance=clientFactory({appId:'java-lab',onChange:(next,failure)=>{setRows(next);if(failure)setError(failure);}});client.current=instance;instance.start();return()=>instance.stop();},[clientFactory]);
  useEffect(()=>{setId('');setError('');},[task.id]);
  const accepted=rows.some(row=>row.id===id&&row.status==='broker_accepted');
  async function submit(){setBusy(true);setError('');try{
    const assignment={generatorVersion:'1',templateId:'java-course-'+lesson.id,seed:getInstallationId(),difficulty:'standard',index:lesson.tasks.findIndex(item=>item.id===task.id)};
    const next=await client.current.submit({assignment,studentId,files});setId(next);await client.current.flush();
    try{const previous=JSON.parse(localStorage.getItem('java-lab-assignment-identity'))||{};localStorage.setItem('java-lab-assignment-identity',JSON.stringify({...previous,studentId}));}catch{}
  }catch(failure){setError(failure.message);}finally{setBusy(false);}}
  return <section className="java-course-submission" aria-label="Oddaj zadanie"><label>ID ucznia <input value={studentId} maxLength={80} onChange={event=>setStudentId(event.target.value)}/></label><button type="button" disabled={busy} onClick={submit}>{busy?'Wysyłanie…':'Oddaj zadanie'}</button>{id&&<p role="status">{accepted?'✓ Wysłano':'Zapisano w kolejce wysyłki.'}</p>}{id&&!accepted&&<button type="button" onClick={()=>client.current.flush()}>Ponów wysyłkę</button>}{error&&<p role="alert">{error}</p>}</section>;
}
