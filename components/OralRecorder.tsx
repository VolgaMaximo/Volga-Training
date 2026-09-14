'use client';
import {useEffect,useRef,useState} from 'react';
import {supabase} from '../lib/supabase';

type Props={scenario:string;scenarioId:number;scenarioIndex:number;attemptId:string;staffName:string;onComplete:()=>void};
type Phase='ready'|'prep'|'recording'|'uploading'|'done'|'save_error';

function chooseMime(){
 const types=['video/mp4;codecs=h264,aac','video/mp4','video/webm;codecs=vp8,opus','video/webm;codecs=vp9,opus','video/webm'];
 return types.find(t=>typeof MediaRecorder!=='undefined'&&MediaRecorder.isTypeSupported(t))||'';
}

export default function OralRecorder({scenario,scenarioId,scenarioIndex,attemptId,staffName,onComplete}:Props){
 const[phase,setPhase]=useState<Phase>('ready');
 const[countdown,setCountdown]=useState(10);
 const[recordLeft,setRecordLeft]=useState(30);
 const[error,setError]=useState('');
 const videoRef=useRef<HTMLVideoElement>(null);
 const streamRef=useRef<MediaStream|null>(null);
 const recorderRef=useRef<MediaRecorder|null>(null);
 const chunksRef=useRef<Blob[]>([]);
 const blobRef=useRef<Blob|null>(null);
 const timerRef=useRef<ReturnType<typeof setInterval>|null>(null);
 const mimeRef=useRef('');
 const uploadPathRef=useRef<string|null>(null);
 const uploadedRef=useRef(false);

 useEffect(()=>()=>{if(timerRef.current)clearInterval(timerRef.current);streamRef.current?.getTracks().forEach(t=>t.stop())},[]);

 async function prepareCamera(){
  setError('');
  try{
   const stream=await navigator.mediaDevices.getUserMedia({
    video:{facingMode:'user',width:{ideal:720},height:{ideal:1280}},
    audio:true
   });
   streamRef.current=stream;
   if(videoRef.current){videoRef.current.srcObject=stream;videoRef.current.muted=true;await videoRef.current.play()}
   startPrep();
  }catch{setError('Нужен доступ к камере и микрофону. Разреши его в настройках браузера и попробуй ещё раз.')}
 }

 function startPrep(){
  setPhase('prep');setCountdown(10);let n=10;
  timerRef.current=setInterval(()=>{n-=1;setCountdown(n);if(n<=0){if(timerRef.current)clearInterval(timerRef.current);startRecording()}},1000)
 }

 function startRecording(){
  const stream=streamRef.current;if(!stream)return;
  chunksRef.current=[];blobRef.current=null;uploadPathRef.current=null;uploadedRef.current=false;
  const mime=chooseMime();mimeRef.current=mime;
  const opts:any={videoBitsPerSecond:1200000,audioBitsPerSecond:96000};
  if(mime)opts.mimeType=mime;
  let recorder:MediaRecorder;
  try{recorder=new MediaRecorder(stream,opts)}catch{recorder=mime?new MediaRecorder(stream,{mimeType:mime}):new MediaRecorder(stream)}
  recorderRef.current=recorder;
  recorder.ondataavailable=e=>{if(e.data.size>0)chunksRef.current.push(e.data)};
  recorder.onstop=()=>{const type=mimeRef.current||chunksRef.current[0]?.type||'video/webm';blobRef.current=new Blob(chunksRef.current,{type});saveRecording()};
  recorder.start(250);
  setPhase('recording');setRecordLeft(30);let n=30;
  timerRef.current=setInterval(()=>{n-=1;setRecordLeft(n);if(n<=0){if(timerRef.current)clearInterval(timerRef.current);stopRecording()}},1000)
 }

 function stopRecording(){
  if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null}
  const recorder=recorderRef.current;
  if(recorder&&recorder.state!=='inactive')recorder.stop();
 }

 async function saveRecording(){
  const blob=blobRef.current;if(!blob)return;
  setPhase('uploading');setError('');
  const ext=blob.type.includes('mp4')?'mp4':'webm';
  if(!uploadPathRef.current)uploadPathRef.current=`${attemptId}/situation-${scenarioIndex+1}-${Date.now()}.${ext}`;
  const path=uploadPathRef.current;
  try{
   if(!supabase)throw new Error('Supabase unavailable');

   if(!uploadedRef.current){
    const{error:uploadError}=await supabase.storage.from('oral-recordings').upload(path,blob,{contentType:blob.type||`video/${ext}`,upsert:false});
    if(uploadError)throw new Error(`upload:${uploadError.message}`);
    uploadedRef.current=true;
   }

   const{error:dbError}=await supabase.from('oral_answers').upsert({attempt_id:attemptId,staff_name:staffName,scenario_id:scenarioId,scenario_text:scenario,scenario_index:scenarioIndex,recording_path:path},{onConflict:'attempt_id,scenario_index'});
   if(dbError)throw new Error(`database:${dbError.message}`);

   const{error:lockError}=await supabase.rpc('mark_oral_answered',{p_attempt_id:attemptId,p_scenario_id:scenarioId});
   if(lockError)throw new Error(`finalize:${lockError.message}`);

   streamRef.current?.getTracks().forEach(t=>t.stop());
   setPhase('done');
  }catch(e){
   console.error('oral-save-error',e);
   setPhase('save_error');
   setError('Не удалось сохранить запись. Сам ответ уже записан — переснимать его не нужно. Нажми «Повторить сохранение».');
  }
 }

 return <div className="card">
  <video ref={videoRef} playsInline autoPlay/>
  {phase==='ready'&&<><p className="warning">После нажатия появится ситуация. Будет 10 секунд на подготовку, затем запись начнётся автоматически. Перезаписи нет.</p><button onClick={prepareCamera}>ПОКАЗАТЬ СИТУАЦИЮ</button></>}
  {phase!=='ready'&&<><h2>{scenario}</h2>
   {phase==='prep'&&<><div className="timer">{countdown}</div><p className="center">Подумай над ответом. Запись начнётся автоматически.</p></>}
   {phase==='recording'&&<><div className="timer">{recordLeft}</div><p className="center"><b>ИДЁТ ЗАПИСЬ · ОДНА ПОПЫТКА</b></p><button onClick={stopRecording}>ЗАКОНЧИТЬ ОТВЕТ</button><p className="small">30 секунд — максимум. Если закончил раньше, нажми кнопку.</p></>}
   {phase==='uploading'&&<p>Сохраняем ответ…</p>}
   {phase==='save_error'&&<><p className="warning">{error}</p><button onClick={saveRecording}>ПОВТОРИТЬ СОХРАНЕНИЕ</button></>}
   {phase==='done'&&<><p className="success">Ответ сохранён. Перезаписать его уже нельзя.</p><button onClick={onComplete}>ПЕРЕЙТИ К СЛЕДУЮЩЕЙ СИТУАЦИИ</button></>}
  </>}
  {error&&phase!=='save_error'&&<p className="warning">{error}</p>}
 </div>
}
