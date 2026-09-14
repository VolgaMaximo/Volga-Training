'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';

export default function Home(){
  const[name,setName]=useState('');
  const[watched,setWatched]=useState(false);
  const[videoMissing,setVideoMissing]=useState(false);
  const router=useRouter();
  function start(){
    if(!name.trim()||!watched)return;
    sessionStorage.setItem('volga_staff_name',name.trim());
    sessionStorage.removeItem('volga_quiz_score');
    sessionStorage.removeItem('volga_oral_done');
    router.push('/quiz');
  }
  return <main>
    <div className="brand">VOLGA · COCINA DEL ESTE · TRAINING</div>
    <h1>ОБУЧЕНИЕ И ЭКЗАМЕН</h1>
    <div className="homeActions">
      <div className="card actionCard"><h2>Учебные материалы</h2><p>Повтори блюда, ключевые формулировки и важные детали перед проверкой.</p><Link className="button secondary" href="/materials">ПОВТОРИТЬ МАТЕРИАЛ</Link></div>
      <div className="card actionCard"><h2>Экзамен</h2><p>Теория + пять ситуаций с гостем с записью ответа.</p><a className="button" href="#exam">ПЕРЕЙТИ К ЭКЗАМЕНУ</a></div>
    </div>
    <div id="exam" className="card introGrid">
      <div>
        <h2>Привет, я MILA.</h2>
        <p>Перед началом посмотри вводный ролик полностью. Ниже правила продублированы текстом.</p>
        <div className="rules">
          <p><b>1.</b> Сначала — тест по блюдам. Для допуска к устной части нужно набрать минимум <b>85%</b>.</p>
          <p><b>2.</b> Затем — <b>5 случайных ситуаций</b>, как в реальном разговоре с гостем.</p>
          <p><b>3.</b> На каждую ситуацию даётся <b>10 секунд на подготовку</b>, после чего запись начинается автоматически.</p>
          <p><b>4.</b> На ответ — <b>30 секунд</b>. Запись только одна, переснять нельзя.</p>
          <p><b>5.</b> Не нужно заучивать текст дословно. Важно объяснить блюдо естественно, правильно и понятно гостю.</p>
        </div>
      </div>
      <div className="milaVideoWrap">
        <video className="milaVideo" controls playsInline onEnded={()=>setWatched(true)} onError={()=>{setVideoMissing(true);setWatched(true)}} src="/mila-intro.mp4">Браузер не может воспроизвести видео.</video>
        {videoMissing?<p className="warning">Ролик MILA пока не загружен. Для проверки механики экзамен уже разблокирован.</p>:<p className="small">После просмотра ролика экзамен разблокируется.</p>}
      </div>
    </div>
    <div className="card">
      <label>Имя сотрудника</label>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Имя и фамилия"/>
      <div style={{height:14}}/>
      <div className="warning">Устная часть: 10 секунд подумать, 30 секунд ответить, одна попытка.</div>
      <div style={{height:14}}/>
      <button disabled={!name.trim()||!watched} onClick={start}>НАЧАТЬ ЭКЗАМЕН</button>
    </div>
  </main>
}
