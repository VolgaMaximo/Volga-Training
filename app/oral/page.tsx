'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import OralRecorder from '../../components/OralRecorder';
import {supabase} from '../../lib/supabase';

type Scenario={pos:number;scenario_id:number;prompt_text:string;answered:boolean};

export default function OralPage(){
 const router=useRouter();
 const[scenarios,setScenarios]=useState<Scenario[]>([]);
 const[index,setIndex]=useState(0);
 const[loading,setLoading]=useState(true);
 const[error,setError]=useState('');
 const attemptId=typeof window!=='undefined'?sessionStorage.getItem('volga_attempt_id'):null;
 const staffName=typeof window!=='undefined'?sessionStorage.getItem('volga_staff_name')||'Сотрудник':'Сотрудник';
 useEffect(()=>{(async()=>{if(!attemptId||!supabase){router.replace('/');return}const{data,error:e}=await supabase.rpc('get_attempt_oral',{p_attempt_id:attemptId});if(e||!Array.isArray(data)){setError('Не удалось загрузить ситуации.');setLoading(false);return}const rows=data as Scenario[];setScenarios(rows);const first=rows.findIndex(x=>!x.answered);if(first===-1){sessionStorage.setItem('volga_oral_done','1');router.replace('/done');return}setIndex(first);setLoading(false)})()},[attemptId,router]);
 async function complete(){if(!attemptId||!supabase)return;const current=scenarios[index];await supabase.rpc('mark_oral_answered',{p_attempt_id:attemptId,p_scenario_id:current.scenario_id});if(index===scenarios.length-1){sessionStorage.setItem('volga_oral_done','1');router.push('/done')}else setIndex(index+1)}
 if(loading)return <main><div className="brand">VOLGA · УСТНАЯ ЧАСТЬ</div><h1>ЗАГРУЗКА…</h1></main>;
 if(error||!scenarios.length)return <main><div className="brand">VOLGA · УСТНАЯ ЧАСТЬ</div><h1>ОШИБКА</h1><div className="warning">{error||'Ситуации не найдены.'}</div></main>;
 return <main><div className="brand">VOLGA · СИТУАЦИИ С ГОСТЕМ</div><h1>ОТВЕЧАЙ ЕСТЕСТВЕННО</h1><div className="progress"><div style={{width:`${(index+1)/scenarios.length*100}%`}}/></div><p className="small">Ситуация {index+1} из {scenarios.length}</p><OralRecorder key={index} scenario={scenarios[index].prompt_text} scenarioId={scenarios[index].scenario_id} scenarioIndex={index} attemptId={attemptId!} staffName={staffName} onComplete={complete}/></main>
}
