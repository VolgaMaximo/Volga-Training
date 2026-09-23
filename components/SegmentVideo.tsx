'use client';
import {useEffect,useRef} from 'react';

type Props={src:string;start?:number;end?:number;className?:string;poster?:string};

export default function SegmentVideo({src,start=0,end,className='milaVideo',poster}:Props){
 const ref=useRef<HTMLVideoElement|null>(null);

 useEffect(()=>{
   const v=ref.current;
   if(!v)return;

   let initialized=false;

   const seekToStart=()=>{
     if(!Number.isFinite(start))return;
     const target=Math.max(0,start);
     try{
       if(Math.abs(v.currentTime-target)>0.25)v.currentTime=target;
       v.pause();
       initialized=true;
     }catch{}
   };

   const onLoadedMetadata=()=>seekToStart();
   const onCanPlay=()=>{if(!initialized)seekToStart()};
   const onPlay=()=>{
     if(v.currentTime<start-0.5 || (end!=null && v.currentTime>=end-0.05)){
       try{v.currentTime=Math.max(0,start)}catch{}
     }
   };
   const onTimeUpdate=()=>{
     if(end!=null && v.currentTime>=end){
       v.pause();
       try{v.currentTime=Math.max(0,start)}catch{}
     }
   };

   v.addEventListener('loadedmetadata',onLoadedMetadata);
   v.addEventListener('canplay',onCanPlay);
   v.addEventListener('play',onPlay);
   v.addEventListener('timeupdate',onTimeUpdate);

   if(v.readyState>=1)seekToStart();

   return()=>{
     v.removeEventListener('loadedmetadata',onLoadedMetadata);
     v.removeEventListener('canplay',onCanPlay);
     v.removeEventListener('play',onPlay);
     v.removeEventListener('timeupdate',onTimeUpdate);
   };
 },[start,end,src]);

 return <video
   key={`${src}-${start}-${end??'full'}`}
   ref={ref}
   className={className}
   controls
   playsInline
   preload="metadata"
   poster={poster}
   src={src}
 >Браузер не может воспроизвести видео.</video>
}
