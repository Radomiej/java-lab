import {useEffect,useRef,useState} from 'react';
import {createSubmissionClient} from '../services/assignmentSubmissions.js';
import {getInstallationId} from '../services/installationId.js';
import {createLessonQuiz} from '../data/lessonQuiz.js';
import {lessonQuizRevision} from '../data/gameIntroPages.js';
import CodeExample from '../../shared/lab-game-v2/editor/CodeExample.jsx';
export default function LessonQuiz({lesson, onContinue}) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [studentId,setStudentId]=useState(()=>{try{return JSON.parse(localStorage.getItem('java-lab-assignment-identity'))?.studentId||'';}catch{return '';}});
  const [error,setError]=useState('');
  const [submissionId,setSubmissionId]=useState('');
  const [rows,setRows]=useState([]);
  const [sending,setSending]=useState(false);
  const client=useRef(null);
  useEffect(()=>{const instance=createSubmissionClient({appId:'java-lab',onChange:(next,failure)=>{setRows(next);if(failure)setError(failure);}});client.current=instance;instance.start();return()=>instance.stop();},[]);
  const accepted=rows.some(row=>row.id===submissionId&&row.status==='broker_accepted');
  async function submit(){
    setSending(true);setError('');
    try{
      const descriptor={generatorVersion:'1',templateId:'java-quiz-'+lesson.id,seed:getInstallationId(),difficulty:'standard',index:lessonQuizRevision(lesson)};
      const id=await client.current.submit({assignment:descriptor,studentId,files:{'answer.json':JSON.stringify({answers:Object.fromEntries(Object.entries(answers).map(([id,value])=>[id,String(value)]))})}});
      setSubmissionId(id);await client.current.flush();
    }catch(failure){setError(failure.message);}finally{setSending(false);}
  }
  const questions = createLessonQuiz(lesson);
  const complete = questions.every(question => Number.isInteger(answers[question.id]));
  const score = questions.filter(question => answers[question.id] === question.correct).length;
  const download = () => {
    const data = {lessonId:lesson.id,lessonTitle:lesson.title,completedAt:new Date().toISOString(),score,total:questions.length,
      answers:questions.map(question => ({question:question.title,answer:question.choices[answers[question.id]],correct:answers[question.id]===question.correct}))};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download=`quiz-${lesson.id}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  return <section className="java-lesson-quiz" aria-label="Quiz lekcji"><h2>Sprawdź, czy rozumiesz</h2>
    <p>{questions.length} krótkie pytania o przykłady z lekcji.</p>
    {questions.map((question,index)=><fieldset key={question.id}><legend>{index+1}. {question.title}</legend>
      <p>{question.prompt}</p>{question.code&&<CodeExample code={question.code}/>}
      {question.choices.map((choice,number)=><label key={number}><input type="radio" name={question.id} checked={answers[question.id]===number} onChange={()=>{setAnswers(current=>({...current,[question.id]:number}));setChecked(false);}}/><span>{choice}</span></label>)}
      {checked&&<p className="java-quiz-feedback">{answers[question.id]===question.correct?'✓ Dobrze.':'Poprawna odpowiedź: '+question.choices[question.correct]} {question.explanation}</p>}
    </fieldset>)}
    <button type="button" disabled={!complete} onClick={()=>setChecked(true)}>Sprawdź odpowiedzi</button>
    {checked&&<><p role="status">Wynik: {score}/{questions.length}. Sprawdzono w tej przeglądarce.</p><button type="button" onClick={download}>Pobierz odpowiedzi</button></>}
    <label>ID ucznia <input value={studentId} maxLength={80} onChange={event=>setStudentId(event.target.value)} /></label>
    <button type="button" disabled={!complete||sending} onClick={submit}>{sending?'Wysyłanie…':'Oddaj quiz'}</button>
    {submissionId&&<p role="status">{accepted?'✓ Wysłano':'Zapisano w kolejce wysyłki.'}</p>}
    {submissionId&&!accepted&&<button type="button" onClick={()=>client.current.flush()}>Ponów wysyłkę</button>}
    {error&&<p role="alert">{error}</p>}
    <button type="button" onClick={onContinue}>Przejdź do zadania →</button>
  </section>;
}
