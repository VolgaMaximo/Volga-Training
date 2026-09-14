'use client';
import {useEffect} from 'react';

const cards=[
'/cards/01-chicken-liver-pate.jpg','/cards/02-mackerel-pate.jpg','/cards/03-forshmak.jpg','/cards/04-three-pates.jpg','/cards/05-eggplant-rolls.jpg','/cards/06-tomato-cucumber.jpg','/cards/07-olivje.jpg','/cards/08-shuba.jpg','/cards/09-vinigret.jpg','/cards/10-salo.jpg','/cards/11-pickles.jpg','/cards/12-nameko.jpg','/cards/13-jolodets.jpg','/cards/14-beet-goat-cheese.jpg','/cards/15-eggs-riga.jpg'
];

export default function MaterialFullscreen(){
  useEffect(()=>{
    if(!location.pathname.startsWith('/materials')) return;

    let overlay:HTMLDivElement|null=null;
    const close=()=>{overlay?.remove();overlay=null;document.body.style.overflow=''};
    const open=(src:string,alt:string)=>{
      close();
      overlay=document.createElement('div');
      overlay.className='materialModal';
      overlay.setAttribute('role','dialog');
      overlay.setAttribute('aria-modal','true');
      const img=document.createElement('img');
      img.className='materialModalImage';img.src=src;img.alt=alt;
      const button=document.createElement('button');
      button.className='materialModalClose';button.type='button';button.setAttribute('aria-label','Закрыть');button.textContent='×';
      button.onclick=close;
      overlay.onclick=(e)=>{if(e.target===overlay)close()};
      overlay.append(img,button);document.body.appendChild(overlay);document.body.style.overflow='hidden';
    };

    const handler=(e:Event)=>{
      const target=e.target as HTMLElement;
      const btn=target.closest('.materialTitle') as HTMLButtonElement|null;
      if(!btn)return;
      const all=Array.from(document.querySelectorAll('.materialTitle'));
      const i=all.indexOf(btn);
      if(i<0||!cards[i])return;
      e.preventDefault();e.stopPropagation();
      open(cards[i],btn.textContent?.replace(/[+−]/g,'').trim()||'Учебная карточка');
    };
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};
    document.addEventListener('click',handler,true);document.addEventListener('keydown',key);
    return()=>{document.removeEventListener('click',handler,true);document.removeEventListener('keydown',key);close()};
  },[]);
  return null;
}
