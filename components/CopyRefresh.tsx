'use client';
import {useEffect} from 'react';

export default function CopyRefresh(){
  useEffect(()=>{
    const replaceExact=(from:string,to:string)=>{
      document.querySelectorAll('div,h1,h2,p,span').forEach(el=>{
        if(el.textContent?.trim()===from) el.textContent=to;
      });
    };
    const removeExact=(text:string)=>{
      document.querySelectorAll('p').forEach(el=>{
        if(el.textContent?.trim()===text) el.remove();
      });
    };

    replaceExact('VOLGA · COCINA DEL ESTE · ОБУЧЕНИЕ','КОМАНДА VOLGA · ЗНАНИЯ ПОМОГАЮТ');
    replaceExact('ОБУЧЕНИЕ И ЭКЗАМЕН','АКАДЕМИЯ VOLGA');
    replaceExact('Повтори блюда, ключевые формулировки и важные детали перед проверкой.','Повтори учебный материал.');
    removeExact('Короткое приветствие перед началом обучения. Здесь первые 1:13 большого ролика по закускам.');
    removeExact('Обучающая часть начинается после приветствия MILA — с отметки 1:13.');
    removeExact('Важно: в паштете из куриной печени используется обычная nata, не nata agria. Исправленная карточка заменит текущую версию.');
  },[]);
  return null;
}
