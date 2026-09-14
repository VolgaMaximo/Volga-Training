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
  const[entered,setEntered]=useState(false);
  const[employees,setEmployees]=useState<Employee[]>([]);
  const[employeeId,setEmployeeId]=useState('');
  const[code,setCode]=useState('');
  const[topic,setTopic]=useState('starters');
  const[busy,setBusy]=useState(false);
  const[error,setError]=useState('');
  const router=useRouter();

  useEffect(()=>{
    if(sessionStorage.getItem('volga_academy_entered')==='1')setEntered(true);
    (async()=>{if(!supabase)return;const{data}=await supabase.rpc('list_employees_public');if(Array.isArray(data))setEmployees(data as Employee[])})();
  },[]);

  function openAcademy(){sessionStorage.setItem('volga_academy_entered','1');setEntered(true)}

  async function start(){
    if(!employeeId||!code||!topic||!supabase)return;
    setBusy(true);setError('');
    const{data,error:e}=await supabase.rpc('begin_or_resume_exam',{p_employee_id:employeeId,p_code:code});
    setBusy(false);
    if(e){setError('Не удалось начать экзамен. Попробуй ещё раз.');return}
    if(!data?.ok){setError(data?.error||'Не удалось начать экзамен.');return}
    sessionStorage.setItem('volga_attempt_id',data.attempt_id);
    sessionStorage.setItem('volga_staff_name',data.name);
    sessionStorage.setItem('volga_exam_topic',topic);
    sessionStorage.removeItem('volga_quiz_score');
    sessionStorage.removeItem('volga_oral_done');
    router.push(data.status==='oral'?'/oral':'/quiz');
  }

  if(!entered)return <div className="academyGate">
    <div className="academyGateArt">
      <img src="/academy-cover.png" alt="VOLGA ACADEMIA — знания дают уверенность и создают лучший сервис"/>
      <button className="academyGateButton" aria-label="Открыть двери академии" onClick={openAcademy}>ОТКРЫТЬ ДВЕРИ АКАДЕМИИ</button>
    </div>
  </div>;

  return <main>
    <div className="brand">VOLGA ACADEMIA</div>
    <h1>ОБУЧЕНИЕ И ЭКЗАМЕН</h1>

    <div className="card introGrid">
      <div><h2>Привет, я MILA.</h2></div>
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
      <button disabled={!employeeId||!code||!topic||busy} onClick={start}>{busy?'ПРОВЕРЯЕМ…':'НАЧАТЬ ЭКЗАМЕН'}</button>
      {error&&<p className="warning">{error}</p>}
    </div>
  </main>
}
