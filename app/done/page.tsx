'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {supabase} from '../../lib/supabase';

export default function DonePage(){
 const[score,setScore]=useState<number|null>(null);
 const[passed,setPassed]=useState(false);
 const[oralDone,setOralDone]=useState(false);
 const[error,setError]=useState('');

 useEffect(()=>{(async()=>{
   const attemptId=sessionStorage.getItem('volga_attempt_id');
   if(!attemptId||!supabase){
     const fallback=Number(sessionStorage.getItem('volga_quiz_score')||0);
     setScore(fallback);setPassed(fallback>=85);setOralDone(sessionStorage.getItem('volga_oral_done')==='1');return;
   }
   const{data,error:e}=await supabase.rpc('get_attempt_result',{p_attempt_id:attemptId});
   if(e||!data?.ok){
     const fallback=Number(sessionStorage.getItem('volga_quiz_score')||0);
     setScore(fallback);setPassed(fallback>=85);setOralDone(sessionStorage.getItem('volga_oral_done')==='1');setError('Не удалось обновить результат из базы.');return;
   }
   const dbScore=Number(data.score||0);
   setScore(dbScore);setPassed(Boolean(data.passed));setOralDone(Boolean(data.oral_completed));
   sessionStorage.setItem('volga_quiz_score',String(dbScore));
   sessionStorage.setItem('volga_quiz_passed',data.passed?'1':'0');
   if(data.oral_completed)sessionStorage.setItem('volga_oral_done','1');
 })()},[]);

 if(score===null)return <main><div className="brand">VOLGA · РЕЗУЛЬТАТ</div><h1>ЗАГРУЗКА…</h1></main>;
 return <main><div className="brand">VOLGA · РЕЗУЛЬТАТ</div><h1>{passed?(oralDone?'ЭКЗАМЕН ЗАВЕРШЁН':'ТЕОРИЯ СДАНА'):'НУЖНО ПОВТОРИТЬ'}</h1><div className="card"><div className="score">{score}%</div>{passed?(oralDone?<p className="success">Ответы сохранены и отправлены администратору на проверку.</p>:<p className="success">Теоретическая часть пройдена.</p>):<p className="warning">Минимум — 85%. Новую попытку сможет разрешить администратор после разбора ошибок.</p>}{error&&<p className="warning">{error}</p>}<div style={{height:14}}/><Link className="button" href="/materials">ПОВТОРИТЬ МАТЕРИАЛ</Link></div></main>
}
