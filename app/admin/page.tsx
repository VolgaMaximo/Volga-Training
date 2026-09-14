'use client';
import {useState} from 'react';
import {supabase} from '../../lib/supabase';

type StaffRow={employee_id:string;name:string;can_retry:boolean;attempt_id:string|null;status:string|null;quiz_score:number|null;created_at:string|null;completed_at:string|null};
type Answer={id:string;attempt_id:string;staff_name:string;scenario_text:string;scenario_index:number;recording_path:string;created_at:string};

export default function AdminPage(){
 const[code,setCode]=useState('');
 const[ok,setOk]=useState(false);
 const[staff,setStaff]=useState<StaffRow[]>([]);
 const[answers,setAnswers]=useState<Answer[]>([]);
 const[links,setLinks]=useState<Record<string,string>>({});
 const[error,setError]=useState('');
 const[newName,setNewName]=useState('');
 const[newPin,setNewPin]=useState('');
 const[tab,setTab]=useState<'staff'|'video'>('staff');

 async function loadAll(adminCode=code){
  if(!supabase)return;
  setError('');
  const{data,error:e}=await supabase.rpc('admin_dashboard',{p_code:adminCode});
  if(e){setError('Неверный PIN администратора.');setOk(false);return}
  setStaff((data||[]) as StaffRow[]);setOk(true);
  const{data:a}=await supabase.from('oral_answers').select('*').order('created_at',{ascending:false});
  const rows=(a||[]) as Answer[];setAnswers(rows);
  const out:Record<string,string>={};
  for(const row of rows){const{data:signed}=await supabase.storage.from('oral-recordings').createSignedUrl(row.recording_path,3600);if(signed?.signedUrl)out[row.id]=signed.signedUrl}
  setLinks(out);
 }

 async function unlock(employeeId:string){if(!supabase)return;const{error:e}=await supabase.rpc('admin_unlock_employee',{p_employee_id:employeeId,p_code:code});if(e){setError('Не удалось разрешить новую попытку.');return}await loadAll()}
 async function addEmployee(){if(!supabase||!newName.trim()||!newPin.trim())return;const{error:e}=await supabase.rpc('admin_upsert_employee',{p_name:newName.trim(),p_employee_code:newPin.trim(),p_admin_code:code,p_employee_id:null});if(e){setError('Не удалось добавить сотрудника. Проверь имя и PIN.');return}setNewName('');setNewPin('');await loadAll()}

 if(!ok)return <main><div className="brand">VOLGA · АДМИНИСТРАТОР</div><h1>УПРАВЛЕНИЕ</h1><div className="card"><label>PIN администратора</label><input type="password" inputMode="numeric" value={code} onChange={e=>setCode(e.target.value)} placeholder="PIN"/><div style={{height:12}}/><button onClick={()=>loadAll()}>ВОЙТИ</button>{error&&<p className="warning">{error}</p>}</div></main>;

 return <main>
  <div className="brand">VOLGA · АДМИНИСТРАТОР</div><h1>УПРАВЛЕНИЕ ЭКЗАМЕНАМИ</h1>
  <div className="adminTabs"><button className={tab==='staff'?'selected':''} onClick={()=>setTab('staff')}>СОТРУДНИКИ</button><button className={tab==='video'?'selected':''} onClick={()=>setTab('video')}>ВИДЕООТВЕТЫ</button></div>
  {error&&<p className="warning">{error}</p>}
  {tab==='staff'&&<>
   <div className="card"><h2>Добавить сотрудника</h2><input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Имя"/><div style={{height:10}}/><input type="password" inputMode="numeric" value={newPin} onChange={e=>setNewPin(e.target.value)} placeholder="Личный PIN сотрудника"/><div style={{height:10}}/><button onClick={addEmployee}>ДОБАВИТЬ</button></div>
   {staff.map(s=><div className="card" key={s.employee_id}><h2>{s.name}</h2><p><b>Статус:</b> {s.status==='quiz'?'Теория':s.status==='oral'?'Устная часть':s.status==='completed'?'Завершён':s.status||'Ещё не начинал'}</p><p><b>Теория:</b> {s.quiz_score===null||s.quiz_score===undefined?'—':`${s.quiz_score}%`}</p><p><b>Новая попытка:</b> {s.can_retry?'разрешена':'заблокирована'}</p><button disabled={s.can_retry} onClick={()=>unlock(s.employee_id)}>РАЗРЕШИТЬ НОВУЮ ПОПЫТКУ</button></div>)}
  </>}
  {tab==='video'&&<>{answers.length===0&&<div className="card">Записанных ответов пока нет.</div>}{answers.map(a=><div className="card" key={a.id}><h2>{a.staff_name}</h2><p className="small">Ситуация {a.scenario_index+1}</p><p>{a.scenario_text}</p>{links[a.id]?<video controls playsInline src={links[a.id]}/>:<p className="warning">Видео пока недоступно.</p>}<p className="small">{new Date(a.created_at).toLocaleString('ru-RU')}</p></div>)}</>}
 </main>
}
