'use client';
import {useEffect} from 'react';

export default function MaterialFullscreen(){
  useEffect(()=>{
    if(!location.pathname.startsWith('/materials')) return;

    document.querySelectorAll<HTMLElement>('.materialBody').forEach(el=>el.style.display='none');
    document.querySelectorAll<HTMLElement>('.materialTitle span').forEach(el=>el.textContent='↗');

    const handler=(e:Event)=>{
      const target=e.target as HTMLElement;
      const btn=target.closest('.materialTitle') as HTMLButtonElement|null;
      if(!btn)return;
      // Card opening is handled by app/materials/page.tsx.
      // Do not intercept clicks here, otherwise later sections can open
      // starter cards by positional index.
    };
    const key=(e:KeyboardEvent)=>{};

    document.addEventListener('click',handler,true);
    document.addEventListener('keydown',key);
    return()=>{
      document.removeEventListener('click',handler,true);
      document.removeEventListener('keydown',key);
    };
  },[]);
  return null;
}
