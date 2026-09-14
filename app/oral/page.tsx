'use client';
import {useMemo,useState} from 'react';
import {useRouter} from 'next/navigation';
import OralRecorder from '../../components/OralRecorder';
import {oralScenarios} from '../../lib/data';
function shuffled<T>(arr:T[]){return [...arr].sort(()=>Math.random()-.5)}
export default function OralPage(){const router=useRouter();const[index,setIndex]=useState(0);const scenarios=useMemo(()=>shuffled(oralScenarios).slice(0,5),[]);const staffName=typeof window!=='undefined'?sessionStorage.getItem('volga_staff_name')||'Empleado':'Empleado';function complete(){if(index===scenarios.length-1){sessionStorage.setItem('volga_oral_done','1');router.push('/done')}else setIndex(index+1)}return <main><div className="brand">VOLGA · SIMULACIÓN CON CLIENTE</div><h1>RESPONDE SIN GUIÓN</h1><div className="progress"><div style={{width:`${(index+1)/scenarios.length*100}%`}}/></div><p className="small">Situación {index+1} de {scenarios.length}</p><OralRecorder key={index} scenario={scenarios[index]} scenarioIndex={index} staffName={staffName} onComplete={complete}/></main>}
