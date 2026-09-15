'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {supabase} from '../lib/supabase';
import SegmentVideo from '../components/SegmentVideo';

type Employee={id:string;name:string};

const ENTRANTES_VIDEO='https://files2.heygen.ai/aws_pacific/avatar_tmp/c194aaec374d4a1caa748ea9358325ff/f1748d211b96caf5d47f7cb7cbb8e07f.mp4?Expires=1789854140&Signature=BxZAfl37ITpacpaWdhXFnXmaJy5efusMrvSEfJSgDGOH-h1dlPJxiugS1CjrWDTBfuuCNL7x78iPT6sI8bDbtqHcoprAHnHJQ48Wm5a9Fbl7mCWd-u6~eE5iqxmp~69A1df0YO2O4-gCSi1EefRS2KWADNT1-qOlW8kJJSBcuuqCEOKB7Zx20-TFDaD1XNj4xej3UA6GDssSqcuS~ar79fhBnFoG-b~9gwKGQUPMReNuV72VVdtEZOZoxX-5LYG0FJcB-n6HwPkVSd-ijpJDPbI4sBanWaFpUy0WbDbksaCgfuf18--UwCuSjUiXaIVIuRn8s54mkfxRFcpW8SVxug__&Key-Pair-Id=K38HBHX5LX3X2H';
const EXAM_VIDEO='https://files2.heygen.ai/aws_pacific/avatar_tmp/c194aaec374d4a1caa748ea9358325ff/f9d66fa1f46fbaf1a2bb47e206b697f3.mp4?Expires=1789999987&Signature=jgS8WfwqDtyJmZxpC~KTVa-gPuNr4dgYmeHudbGXABPgE7GuQgQe9SgHGhUCYD6hMkokNetbt6ERZnGlsoi~cdk37f4NBxtH602hMUn1916v9rWLsSL4UevBXkK6fdnM8FtBBlM2ua9Ko8Jea4LXeAXiNrtHCk4bJVOdnJ023DJYfOQGy6XKQFsMa3Y44iwcng6Fyr7d29pCc4Q~UJeKHig13tZjKhGcUdQVpEHGyStba19pIsK78rfuN8wcU4G86zgp08WukAwYBiwEmZtGxfCZTGfuP68R-uBvJWMxvyMcJM03SVarrBhP8MP44cRTqVyK83HOaZTlrGVGxVoeKA__&Key-Pair-Id=K38HBHX5LX3X2H';

export default function Home(){
  const[doorOpened,setDoorOpened]=useState(false);
  const[authenticated,setAuthenticated]=useState(false);
  const[employees,setEmployees]=useState<Employee[]>([]);
  const[employeeId,setEmployeeId]=useState('');
  const[staffName,setStaffName]=useState('');
  const[code,setCode]=useState('');
  const[sessionToken,setSessionToken]=useState('');
  const[topic,setTopic]=useState('starters');
  const[busy,setBusy]=useState(false);
  const[error,setError]=useState('');
  const router=useRouter();

  useEffect(()=>{
    const token=sessionStorage.getItem('volga_staff_session')||'';
    const id=sessionStorage.getItem('volga_staff_id')||'';
    const name=sessionStorage.getItem('volga_staff_name')||'';
    if(token&&id){
      setDoorOpened(true);
      setAuthenticated(true);
      setSessionToken(token);
      setEmployeeId(id);
      setStaffName(name);
    }else{
      sessionStorage.removeItem('volga_staff_access');
    }
    (async()=>{if(!supabase)return;const{data}=await supabase.rpc('list_employees_public');if(Array.isArray(data))setEmployees(data as Employee[])})();
  },[]);

  function openAcademy(){setDoorOpened(true);setError('')}

  async function enterAcademy(){
    if(!employeeId||!code||!supabase)return;
    setBusy(true);setError('');
    const{data,error:e}=await supabase.rpc('verify_staff_access',{p_employee_id:employeeId,p_code:code});
    setBusy(false);
    if(e){setError('Не удалось проверить доступ. Попробуй ещё раз.');return}
    if(!data?.ok||!data?.session_token){setError(data?.error||'Неверный PIN.');return}
    const name=data.name||employees.find(e=>e.id===employeeId)?.name||'';
    const token=String(data.session_token);
    setStaffName(name);
    setSessionToken(token);
    setCode('');
    setAuthenticated(true);
    sessionStorage.setItem('volga_staff_access','1');
    sessionStorage.setItem('volga_staff_id',employeeId);
    sessionStorage.setItem('volga_staff_name',name);
    sessionStorage.setItem('volga_staff_session',token);
  }

  function logout(){
    sessionStorage.removeItem('volga_staff_access');
    sessionStorage.removeItem('volga_staff_id');
    sessionStorage.removeItem('volga_staff_name');
    sessionStorage.removeItem('volga_staff_session');
    sessionStorage.removeItem('volga_attempt_id');
    sessionStorage.removeItem('volga_exam_topic');
    setAuthenticated(false);setDoorOpened(true);setEmployeeId('');setStaffName('');setSessionToken('');setCode('');setError('');
  }

  async function start(){
    if(!sessionToken||!topic||!supabase)return;
    setBusy(true);setError('');
    const{data,error:e}=await supabase.rpc('begin_or_resume_exam_session',{p_session_token:sessionToken,p_topic:topic});
    setBusy(false);
    if(e){setError('Не удалось начать экзамен. Попробуй ещё раз.');return}
    if(!data?.ok){
      const message=data?.error||'Не удалось начать экзамен.';
      setError(message);
      if(message.includes('Сессия истекла')){
        sessionStorage.removeItem('volga_staff_session');
        sessionStorage.removeItem('volga_staff_access');
        setSessionToken('');
        setAuthenticated(false);
      }
      return;
    }
    sessionStorage.setItem('volga_attempt_id',data.attempt_id);
    sessionStorage.setItem('volga_staff_name',data.name);
    sessionStorage.setItem('volga_exam_topic',topic);
    if(!data.resumed){
      sessionStorage.removeItem('volga_quiz_score');
      sessionStorage.removeItem('volga_quiz_passed');
      sessionStorage.removeItem('volga_oral_done');
    }
    router.push(data.status==='oral'?'/oral':'/quiz');
  }

  if(!doorOpened)return <div className="academyGate">
    <div className="academyGateArt">
      <img src="/academy-cover.png?v=20260915" alt="VOLGA ACADEMIA — знания дают уверенность и создают лучший сервис"/>
      <button className="academyGateButton" onClick={openAcademy}>ОТКРЫТЬ ДВЕРИ АКАДЕМИИ</button>
    </div>
  </div>;

  if(!authenticated)return <main className="accessPage">
    <div className="brand">VOLGA ACADEMIA</div>
    <h1>ВХОД В АКАДЕМИЮ</h1>
    <div className="card accessCard">
      <h2>Сотрудник</h2>
      <p>Выбери своё имя и введи личный PIN.</p>
      <label>Сотрудник</label>
      <select value={employeeId} onChange={e=>setEmployeeId(e.target.value)}>
        <option value="">Выбери своё имя</option>
        {employees.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
      </select>
      <div style={{height:14}}/>
      <label>Личный PIN</label>
      <input type="password" inputMode="numeric" value={code} onChange={e=>setCode(e.target.value)} placeholder="4 цифры" onKeyDown={e=>{if(e.key==='Enter')enterAcademy()}}/>
      <div style={{height:14}}/>
      <button disabled={!employeeId||!code||busy} onClick={enterAcademy}>{busy?'ПРОВЕРЯЕМ…':'ВОЙТИ В АКАДЕМИЮ'}</button>
      {error&&<p className="warning">{error}</p>}
    </div>
    <div className="adminEntry"><Link href="/admin">АДМИНИСТРАТИВНЫЙ ВХОД</Link></div>
  </main>;

  return <main>
    <div className="academyTopbar"><div><div className="brand">VOLGA ACADEMIA</div><div className="small">{staffName?`Сотрудник: ${staffName}`:''}</div></div><button className="logoutButton" onClick={logout}>ВЫЙТИ</button></div>
    <h1>ОБУЧЕНИЕ И ЭКЗАМЕН</h1>

    <div className="card introGrid">
      <div><h2>Привет, {staffName||'это MILA'}.</h2></div>
      <div className="milaVideoWrap"><SegmentVideo src={ENTRANTES_VIDEO} start={0} end={73}/></div>
    </div>

    <div className="homeActions">
      <div className="card actionCard"><h2>Учебные материалы</h2><p>Повтори учебный материал.</p><Link className="button secondary" href="/materials">ПОВТОРИТЬ МАТЕРИАЛ</Link></div>
      <div className="card actionCard"><h2>Экзамен</h2><p>Теория и пять ситуаций с гостем с записью ответа.</p><a className="button" href="#exam">ПЕРЕЙТИ К ЭКЗАМЕНУ</a></div>
    </div>

    <div id="exam" className="card introGrid">
      <div>
        <span className="sectionEyebrow">ПЕРЕД ЭКЗАМЕНОМ</span>
        <h2>Правила экзамена</h2>
        <p>Посмотри короткое объяснение MILA. Правила продублированы текстом.</p>
        <div className="rules">
          <p><b>1.</b> Сначала — тест по блюдам. Для допуска к устной части нужно набрать минимум <b>85%</b>.</p>
          <p><b>2.</b> Затем — <b>5 случайных ситуаций</b>, как в реальном разговоре с гостем.</p>
          <p><b>3.</b> На каждую ситуацию даётся <b>10 секунд на подготовку</b>, после чего запись начинается автоматически.</p>
          <p><b>4.</b> На ответ — максимум <b>30 секунд</b>. Если закончил раньше, нажми «Закончить ответ».</p>
          <p><b>5.</b> Запись только одна, переснять нельзя. Не нужно заучивать текст дословно — важно объяснить блюдо естественно и правильно.</p>
        </div>
      </div>
      <div className="milaVideoWrap"><SegmentVideo src={EXAM_VIDEO}/></div>
    </div>

    <div className="card">
      <label>Тема экзамена</label>
      <select value={topic} onChange={e=>setTopic(e.target.value)}>
        <option value="starters">Закуски</option>
        <option value="soups" disabled>Супы — скоро</option>
        <option value="mains" disabled>Горячее — скоро</option>
        <option value="desserts" disabled>Десерты — скоро</option>
        <option value="drinks" disabled>Напитки — скоро</option>
        <option value="service" disabled>Сервис — скоро</option>
      </select>
      <div style={{height:14}}/>
      <p><b>Сотрудник:</b> {staffName}</p>
      <div className="warning">Одна активная попытка. Если экзамен уже начат, система вернёт тебя в неё. Новую попытку разрешает администратор.</div>
      <div style={{height:14}}/>
      <button disabled={!sessionToken||!topic||busy} onClick={start}>{busy?'ОТКРЫВАЕМ…':'НАЧАТЬ ЭКЗАМЕН'}</button>
      {error&&<p className="warning">{error}</p>}
    </div>
  </main>
}
