'use client';
import {useEffect,useRef} from 'react';

type Props={src:string;start?:number;end?:number;className?:string;poster?:string};

export default function SegmentVideo({src,start=0,end,className='milaVideo',poster}:Props){
 const ref=useRef<HTMLVideoElement|null>(null);
 useEffect(()=>{
   const v=ref.current;if(!v)return;
   const showFirstFrame=()=>{
     const target=Math.max(0,start+(start===0?0.05:0));
     if(Number.isFinite(target)){
       try{v.currentTime=target}catch{}
       v.pause();
     }
   };
   const tick=()=>{if(end&&v.currentTime>=end){v.pause();v.currentTime=start}};
   v.addEventListener('loadedmetadata',showFirstFrame);
   v.addEventListener('loadeddata',showFirstFrame);
   v.addEventListener('timeupdate',tick);
   if(v.readyState>=2)showFirstFrame();
   return()=>{
     v.removeEventListener('loadedmetadata',showFirstFrame);
     v.removeEventListener('loadeddata',showFirstFrame);
     v.removeEventListener('timeupdate',tick);
   };
 },[start,end,src]);
 return <video ref={ref} className={className} controls playsInline preload="auto" poster={poster} src={src}>Браузер не может воспроизвести видео.</video>
}
