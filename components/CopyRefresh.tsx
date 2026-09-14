'use client';
import {useEffect} from 'react';

export default function CopyRefresh(){
  useEffect(()=>{
    const replaceExact=(from:string,to:string)=>{
      document.querySelectorAll('div,h1,h2,p,span').forEach(el=>{
        if(el.textContent?.trim()===from) el.textContent=to;
      });
    };

    replaceExact('VOLGA · COCINA DEL ESTE · ОБУЧЕНИЕ','КОМАНДА VOLGA · ЗНАНИЯ ПОМОГАЮТ');
    replaceExact('ОБУЧЕНИЕ И ЭКЗАМЕН','АКАДЕМИЯ VOLGA');
    replaceExact('Повтори блюда, ключевые формулировки и важные детали перед проверкой.','Повтори учебный материал.');
    replaceExact('Короткое приветствие перед началом обучения. Здесь первые 1:13 большого ролика по закускам.','');
    replaceExact('Обучающая часть начинается после приветствия MILA — с отметки 1:13.','Посмотри видеоурок перед карточками.');
  },[]);
  return null;
}
