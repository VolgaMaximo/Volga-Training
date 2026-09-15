'use client';
import {useMemo,useState} from 'react';
import {supabase} from '../../lib/supabase';

type StaffRow={employee_id:string;name:string;can_retry:boolean;attempt_id:string|null;status:string|null;quiz_score:number|null;created_at:string|null;completed_at:string|null};
type Attempt={attempt_id:string;employee_id:string;staff_name:string;topic:string;status:string;quiz_score:number|null;created_at:string;completed_at:string|null;video_count:number};
type Answer={id:string;attempt_id:string;employee_id:string;staff_name:string;topic:string;scenario_text:string;scenario_index:number;recording_path:string;created_at:string};

const TOPICS:{[k:string]:string}={starters:'ЗАКУСКИ',soups:'СУПЫ',mains:'ГОРЯЧЕЕ',desserts:'ДЕСЕРТЫ',drinks:'НАПИТКИ',service:'СЕРВИС'};
const topicLabel=(k:string)=>TOPICS[k]||k||'БЕЗ ТЕМЫ';
const statusLabel=(s:string|null)=>s==='quiz'?'Теория':s==='oral'?'Устная часть':s==='completed'?'Завершён':s||'Ещё не начинал';
const fmt=(v:string|null)=>v?new Date(v).toLocaleString('ru-RU'):'—';

export default function AdminPage(){
 const[code,setCode]=useState('');
 const[ok,setOk]=useState(false);
 const[staff,setStaff]=useState<StaffRow[]>([]);
 const[attempts,setAttempts]=useState<Attempt[]>([]);
 const[answers,setAnswers]=useState<Answer[]>([]);
 const[links,setLinks]=useState<Record<string,string>>({});
 const[error,setError]=useState('');
 const[notice,setNotice]=useState('');
 const[newName,setNewName]=useState('');
 const[newPin,setNewPin]=useState('');
 const[pinDraft,setPinDraft]=useState<Record<string,string>>({});
 const[tab,setTab]=useState<'staff'|'exams'|'video'>('staff');
 const[topicFilter,setTopicFilter]=useState('all');
 const[staffFilter,setStaffFilter]=useState('all');
 const[busyId,setBusyId]=useState('');

 async function loadAll(adminCode=code){
  if(!supabase)return;
  setError('');setNotice('');
  const[{data:d,error:de},{data:h,error:he},{data:a,error:ae}]=await Promise.all([
    supabase.rpc('admin_dashboard',{p_code:adminCode}),
    supabase.rpc('admin_attempt_history',{p_code:adminCode}),
    supabase.rpc('admin_oral_answers',{p_code:adminCode})
  ]);
  if(de||he||ae){setError('Неверный PIN администратора или не удалось загрузить данные.');setOk(false);return}
  setStaff((d||[]) as StaffRow[]);setAttempts((h||[]) as Attempt[]);const rows=(a||[]) as Answer[];setAnswers(rows);setOk(true);
  const paths=[...new Set(rows.map(r=>r.recording_path).filter(Boolean))];
  if(paths.length){
    const{data:edge,error:edgeError}=await supabase.functions.invoke('admin-recordings',{body:{action:'sign',code:adminCode,paths}});
    if(!edgeError&&edge?.links){
      const byId:Record<string,string>={};
      for(const row of rows){if(edge.links[row.recording_path])byId[row.id]=edge.links[row.recording_path]}
      setLinks(byId);
    }else setLinks({});
  }else setLinks({});
 }

 async function unlock(employeeId:string){if(!supabase)return;setBusyId(employeeId);setError('');const{error:e}=await supabase.rpc('admin_unlock_employee',{p_employee_id:employeeId,p_code:code});setBusyId('');if(e){setError('Не удалось разрешить новую попытку.');return}setNotice('Новая попытка разрешена.');await loadAll()}
 async function addEmployee(){if(!supabase||!newName.trim()||!newPin.trim())return;setError('');const{error:e}=await supabase.rpc('admin_upsert_employee',{p_name:newName.trim(),p_employee_code:newPin.trim(),p_admin_code:code,p_employee_id:null});if(e){setError('Не удалось добавить сотрудника. Проверь имя и PIN.');return}setNewName('');setNewPin('');setNotice('Сотрудник добавлен.');await loadAll()}
 async function changePin(s:StaffRow){if(!supabase)return;const pin=(pinDraft[s.employee_id]||'').trim();if(!pin){setError('Введи новый PIN.');return}setBusyId(`pin-${s.employee_id}`);setError('');const{error:e}=await supabase.rpc('admin_upsert_employee',{p_name:s.name,p_employee_code:pin,p_admin_code:code,p_employee_id:s.employee_id});setBusyId('');if(e){setError('Не удалось изменить PIN сотрудника.');return}setPinDraft(v=>({...v,[s.employee_id]:''}));setNotice(`PIN для ${s.name} изменён.`)}

 async function deleteOne(a:Answer){
  if(!supabase||!confirm(`Удалить видео ${a.staff_name}: «${a.scenario_text}»? Это действие нельзя отменить.`))return;
  setBusyId(a.id);setError('');
  const{data,e:errorEdge}=await supabase.functions.invoke('admin-recordings',{body:{action:'delete_one',code,id:a.id}});
  setBusyId('');
  if(errorEdge||!data?.ok){setError(data?.error||'Не удалось удалить видео.');return}
  setNotice('Видео удалено из хранилища и из списка.');await loadAll();
 }
 async function deleteAttempt(attemptId:string,staffName:string){
  const count=answers.filter(a=>a.attempt_id===attemptId).length;
  if(!supabase||!count||!confirm(`Удалить все видео этой попытки (${count}) у ${staffName}? Это действие нельзя отменить.`))return;
  setBusyId(`attempt-${attemptId}`);setError('');
  const{data,e:errorEdge}=await supabase.functions.invoke('admin-recordings',{body:{action:'delete_attempt',code,attempt_id:attemptId}});
  setBusyId('');
  if(errorEdge||!data?.ok){setError(data?.error||'Не удалось очистить видео попытки.');return}
  setNotice(`Удалено видео: ${data.count||count}.`);await loadAll();
 }

 const topics=useMemo(()=>[...new Set(attempts.map(a=>a.topic).filter(Boolean))],[attempts]);
 const filteredAttempts=attempts.filter(a=>(topicFilter==='all'||a.topic===topicFilter)&&(staffFilter==='all'||a.employee_id===staffFilter));
 const filteredAnswers=answers.filter(a=>(topicFilter==='all'||a.topic===topicFilter)&&(staffFilter==='all'||a.employee_id===staffFilter));
 const groupedAttempts=useMemo(()=>{
  const out:Record<string,Attempt[]>={};for(const a of filteredAttempts)(out[a.topic]??=[]).push(a);return out;
 },[filteredAttempts]);

 if(!ok)return <main><div className="brand">VOLGA · АДМИНИСТРАТОР</div><h1>УПРАВЛЕНИЕ</h1><div className="card"><label>PIN администратора</label><input type="password" inputMode="numeric" value={code} onChange={e=>setCode(e.target.value)} placeholder="PIN" onKeyDown={e=>{if(e.key==='Enter')loadAll()}}/><div style={{height:12}}/><button onClick={()=>loadAll()}>ВОЙТИ</button>{error&&<p className="warning">{error}</p>}</div></main>;

 return <main>
  <div className="brand">VOLGA · АДМИНИСТРАТОР</div><h1>УПРАВЛЕНИЕ АКАДЕМИЕЙ</h1>
  <div className="adminTabs"><button className={tab==='staff'?'selected':''} onClick={()=>setTab('staff')}>СОТРУДНИКИ</button><button className={tab==='exams'?'selected':''} onClick={()=>setTab('exams')}>ЭКЗАМЕНЫ</button><button className={tab==='video'?'selected':''} onClick={()=>setTab('video')}>ВИДЕООТВЕТЫ</button></div>
  {error&&<p className="warning">{error}</p>}{notice&&<p className="success">{notice}</p>}

  {tab==='staff'&&<>
   <div className="card"><h2>Добавить сотрудника</h2><input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Имя"/><div style={{height:10}}/><input type="password" inputMode="numeric" value={newPin} onChange={e=>setNewPin(e.target.value)} placeholder="Личный PIN сотрудника"/><div style={{height:10}}/><button onClick={addEmployee}>ДОБАВИТЬ</button></div>
   <div className="adminList">{staff.map(s=><div className="card" key={s.employee_id}><div className="adminCardHead"><div><h2>{s.name}</h2><p className="small">{statusLabel(s.status)} · теория {s.quiz_score==null?'—':`${s.quiz_score}%`}</p></div></div><p><b>Новая попытка:</b> {s.can_retry?'разрешена':'заблокирована'}</p><div className="adminActionRow"><button disabled={s.can_retry||busyId===s.employee_id} onClick={()=>unlock(s.employee_id)}>РАЗРЕШИТЬ НОВУЮ ПОПЫТКУ</button></div><div className="adminPinBox"><label>Сменить PIN</label><div className="adminActionRow"><input type="password" inputMode="numeric" value={pinDraft[s.employee_id]||''} onChange={e=>setPinDraft(v=>({...v,[s.employee_id]:e.target.value}))} placeholder="Новый PIN"/><button disabled={!pinDraft[s.employee_id]||busyId===`pin-${s.employee_id}`} onClick={()=>changePin(s)}>СОХРАНИТЬ PIN</button></div></div></div>)}</div>
  </>}

  {tab==='exams'&&<>
   <div className="card adminFilters"><div><label>Раздел</label><select value={topicFilter} onChange={e=>setTopicFilter(e.target.value)}><option value="all">Все разделы</option>{topics.map(t=><option key={t} value={t}>{topicLabel(t)}</option>)}</select></div><div><label>Сотрудник</label><select value={staffFilter} onChange={e=>setStaffFilter(e.target.value)}><option value="all">Все сотрудники</option>{staff.map(s=><option key={s.employee_id} value={s.employee_id}>{s.name}</option>)}</select></div></div>
   {Object.keys(groupedAttempts).length===0&&<div className="card">Попыток по выбранному фильтру нет.</div>}
   {Object.entries(groupedAttempts).map(([topic,items])=><section key={topic} className="adminTopicSection"><div className="sectionHeader"><div><span className="sectionEyebrow">РАЗДЕЛ</span><h2>{topicLabel(topic)}</h2></div><span className="sectionCount">{items.length} ПОПЫТОК</span></div>{items.map(a=><div className="card" key={a.attempt_id}><div className="adminCardHead"><div><h2>{a.staff_name}</h2><p className="small">{fmt(a.created_at)}</p></div><span className="adminBadge">{statusLabel(a.status)}</span></div><div className="adminStats"><span>Теория <b>{a.quiz_score==null?'—':`${a.quiz_score}%`}</b></span><span>Видео <b>{a.video_count}</b></span></div>{a.video_count>0&&<button className="dangerButton" disabled={busyId===`attempt-${a.attempt_id}`} onClick={()=>deleteAttempt(a.attempt_id,a.staff_name)}>УДАЛИТЬ ВСЕ ВИДЕО ПОПЫТКИ</button>}</div>)}</section>)}
  </>}

  {tab==='video'&&<>
   <div className="card adminFilters"><div><label>Раздел</label><select value={topicFilter} onChange={e=>setTopicFilter(e.target.value)}><option value="all">Все разделы</option>{topics.map(t=><option key={t} value={t}>{topicLabel(t)}</option>)}</select></div><div><label>Сотрудник</label><select value={staffFilter} onChange={e=>setStaffFilter(e.target.value)}><option value="all">Все сотрудники</option>{staff.map(s=><option key={s.employee_id} value={s.employee_id}>{s.name}</option>)}</select></div></div>
   {filteredAnswers.length===0&&<div className="card">Записанных ответов по выбранному фильтру нет.</div>}
   {filteredAnswers.map(a=><div className="card adminVideoCard" key={a.id}><div className="adminCardHead"><div><span className="sectionEyebrow">{topicLabel(a.topic)}</span><h2>{a.staff_name}</h2><p className="small">Ситуация {a.scenario_index+1} · {fmt(a.created_at)}</p></div></div><p>{a.scenario_text}</p>{links[a.id]?<video controls playsInline src={links[a.id]}/>:<p className="warning">Видео пока недоступно.</p>}<div className="adminActionRow"><button className="dangerButton" disabled={busyId===a.id} onClick={()=>deleteOne(a)}>УДАЛИТЬ ВИДЕО</button><button className="dangerOutlineButton" disabled={busyId===`attempt-${a.attempt_id}`} onClick={()=>deleteAttempt(a.attempt_id,a.staff_name)}>ОЧИСТИТЬ ВСЮ ПОПЫТКУ</button></div></div>)}
  </>}
 </main>
}
