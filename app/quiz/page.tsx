'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {supabase} from '../../lib/supabase';

type Question={pos:number;question_id:number;question_text:string;options:string[];selected_index:number|null};

export default function QuizPage(){
 const router=useRouter();
 const[questions,setQuestions]=useState<Question[]>([]);
 const[index,setIndex]=useState(0);
 const[answers,setAnswers]=useState<Record<number,number>>({});
 const[loading,setLoading]=useState(true);
 const[error,setError]=useState('');
 const attemptId=typeof window!=='undefined'?sessionStorage.getItem('volga_attempt_id'):null;

 useEffect(()=>{(async()=>{if(!attemptId||!supabase){router.replace('/');return}const{data,error:e}=await supabase.rpc('get_attempt_quiz',{p_attempt_id:attemptId});if(e||!Array.isArray(data)){setError('Не удалось загрузить вопросы.');setLoading(false);return}const rows=(data as any[]).map(r=>({...r,options:Array.isArray(r.options)?r.options:[]}));setQuestions(rows as Question[]);const restored:Record<number,number>={};rows.forEach((r:any)=>{if(r.selected_index!==null&&r.selected_index!==undefined)restored[r.question_id]=r.selected_index});setAnswers(restored);setLoading(false)})()},[attemptId,router]);

 if(loading)return <main><div className="brand">VOLGA · ЭКЗАМЕН</div><h1>ЗАГРУЗКА…</h1></main>;
 if(error||!questions.length)return <main><div className="brand">VOLGA · ЭКЗАМЕН</div><h1>ОШИБКА</h1><div className="warning">{error||'Вопросы не найдены.'}</div></main>;
 const q=questions[index]; const selected=answers[q.question_id];
 function choose(i:number){setAnswers({...answers,[q.question_id]:i})}
 async function next(){
  if(selected===undefined)return;
  if(index<questions.length-1){setIndex(index+1);return}
  if(!supabase||!attemptId)return;
  const payload=questions.map(x=>({question_id:x.question_id,selected_index:answers[x.question_id]}));
  const{data,error:e}=await supabase.rpc('submit_attempt_quiz',{p_attempt_id:attemptId,p_answers:payload});
  if(e||!data?.ok){setError(data?.error||'Не удалось сохранить ответы.');return}
  sessionStorage.setItem('volga_quiz_score',String(data.score));
  sessionStorage.setItem('volga_quiz_passed',data.passed?'1':'0');
  router.push(data.passed?'/oral':'/done');
 }
 return <main>
  <div className="brand">VOLGA · ТЕОРИЯ</div>
  <h1>ТЕСТ</h1>
  <div className="progress"><div style={{width:`${(index+1)/questions.length*100}%`}}/></div>
  <div className="card">
   <p className="small">Вопрос {index+1} из {questions.length}</p>
   <h2>{q.question_text}</h2>
   {q.options.map((opt,i)=><button key={i} className={`option ${selected===i?'selected':''}`} onClick={()=>choose(i)}>{opt}</button>)}
   <button disabled={selected===undefined} onClick={next}>{index===questions.length-1?'ЗАВЕРШИТЬ ТЕСТ':'СЛЕДУЮЩИЙ ВОПРОС'}</button>
   {error&&<p className="warning">{error}</p>}
  </div>
  <p className="small">Для перехода к устной части нужно набрать минимум 85%.</p>
 </main>
}
