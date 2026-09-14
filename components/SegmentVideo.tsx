'use client';
import {useEffect,useRef} from 'react';

type Props={src:string;start?:number;end?:number;className?:string;poster?:string};

export default function SegmentVideo({src,start=0,end,className='milaVideo',poster}:Props){
 const ref=useRef<HTMLVideoElement|null>(null);
 useEffect(()=>{
   const v=ref.current;if(!v)return;
   const seek=()=>{if(Number.isFinite(start)&&start>0&&Math.abs(v.currentTime-start)>1)v.currentTime=start};
   const tick=()=>{if(end&&v.currentTime>=end){v.pause();v.currentTime=start}};
   v.addEventListener('loadedmetadata',seek);v.addEventListener('timeupdate',tick);
   return()=>{v.removeEventListener('loadedmetadata',seek);v.removeEventListener('timeupdate',tick)};
 },[start,end,src]);
 return <video ref={ref} className={className} controls playsInline preload="metadata" poster={poster} src={src}>Браузер не может воспроизвести видео.</video>
}
