'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {supabase} from '../lib/supabase';

type Employee={id:string;name:string};

export default function Home(){
  const[employees,setEmployees]=useState<Employee[]>([]);
  const[employeeId,setEmployeeId]=useState('');
  const[code,setCode]=useState('');
  const[videoMissing,setVideoMissing]=useState(false);
  const[busy,setBusy]=useState(false);
  const[error,setError]=useState('');
  const router=useRouter();

  useEffect(()=>{(async()=>{if(!supabase)return;const{data}=await supabase.rpc('list_employees_public');if(Array.isArray(data))setEmployees(data as Employee[])})()},[]);

  async function start(){
    if(!employeeId||!code||!supabase)return;
    setBusy(true);setError('');
    const{data,error:e}=await supabase.rpc('begin_or_resume_exam',{p_employee_id:employeeId,p_code:code});
    setBusy(false);
    if(e){setError('Не удалось начать экзамен. Попробуй ещё раз.');return}
    if(!data?.ok){setError(data?.error||'Не удалось начать экзамен.');return}
    sessionStorage.setItem('volga_attempt_id',data.attempt_id);
    sessionStorage.setItem('volga_staff_name',data.name);
    sessionStorage.removeItem('volga_quiz_score');
    sessionStorage.removeItem('volga_oral_done');
    router.push(data.status==='oral'?'/oral':'/quiz');
  }

  return <main>
    <div className="brand">VOLGA · COCINA DEL ESTE · ОБУЧЕНИЕ</div>
    <h1>ОБУЧЕНИЕ И ЭКЗАМЕН</h1>
    <div className="homeActions">
      <div className="card actionCard"><h2>Учебные материалы</h2><p>Повтори блюда, ключевые формулировки и важные детали перед проверкой.</p><Link className="button secondary" href="/materials">ПОВТОРИТЬ МАТЕРИАЛ</Link></div>
      <div className="card actionCard"><h2>Экзамен</h2><p>Теория и пять ситуаций с гостем с записью ответа.</p><a className="button" href="#exam">ПЕРЕЙТИ К ЭКЗАМЕНУ</a></div>
    </div>
    <div id="exam" className="card introGrid">
      <div>
        <h2>Привет, я MILA.</h2>
        <p>Перед началом посмотри вводный ролик. Правила продублированы текстом.</p>
        <div className="rules">
          <p><b>1.</b> Сначала — тест по блюдам. Для допуска к устной части нужно набрать минимум <b>85%</b>.</p>
          <p><b>2.</b> Затем — <b>5 случайных ситуаций</b>, как в реальном разговоре с гостем.</p>
          <p><b>3.</b> На каждую ситуацию даётся <b>10 секунд на подготовку</b>, после чего запись начинается автоматически.</p>
          <p><b>4.</b> На ответ — максимум <b>30 секунд</b>. Если закончил раньше, нажми «Закончить ответ».</p>
          <p><b>5.</b> Запись только одна, переснять нельзя. Не нужно заучивать текст дословно — важно объяснить блюдо естественно и правильно.</p>
        </div>
      </div>
      <div className="milaVideoWrap">
        <video className="milaVideo" controls playsInline onError={()=>setVideoMissing(true)} src="/mila-intro.mp4">Браузер не может воспроизвести видео.</video>
        {videoMissing?<p className="warning">Ролик MILA пока не загружен на сайт. Экзамен для проверки механики доступен.</p>:<p className="small">После просмотра можно начинать экзамен.</p>}
      </div>
    </div>
    <div className="card">
      <label>Сотрудник</label>
      <select value={employeeId} onChange={e=>setEmployeeId(e.target.value)}>
        <option value="">Выбери своё имя</option>
        {employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
      </select>
      <div style={{height:14}}/>
      <label>Личный PIN</label>
      <input type="password" inputMode="numeric" value={code} onChange={e=>setCode(e.target.value)} placeholder="4 цифры"/>
      <div style={{height:14}}/>
      <div className="warning">Одна активная попытка. Если экзамен уже начат, система вернёт тебя в неё. Новую попытку разрешает администратор.</div>
      <div style={{height:14}}/>
      <button disabled={!employeeId||!code||busy} onClick={start}>{busy?'ПРОВЕРЯЕМ…':'НАЧАТЬ ЭКЗАМЕН'}</button>
      {error&&<p className="warning">{error}</p>}
    </div>
  </main>
}
