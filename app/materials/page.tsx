'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import SegmentVideo from '../../components/SegmentVideo';

type Material={id:number;title:string;body:string;image:string};
type Section={key:string;label:string;active:boolean};

const ENTRANTES_VIDEO='https://files2.heygen.ai/aws_pacific/avatar_tmp/c194aaec374d4a1caa748ea9358325ff/f1748d211b96caf5d47f7cb7cbb8e07f.mp4?Expires=1789854140&Signature=BxZAfl37ITpacpaWdhXFnXmaJy5efusMrvSEfJSgDGOH-h1dlPJxiugS1CjrWDTBfuuCNL7x78iPT6sI8bDbtqHcoprAHnHJQ48Wm5a9Fbl7mCWd-u6~eE5iqxmp~69A1df0YO2O4-gCSi1EefRS2KWADNT1-qOlW8kJJSBcuuqCEOKB7Zx20-TFDaD1XNj4xej3UA6GDssSqcuS~ar79fhBnFoG-b~9gwKGQUPMReNuV72VVdtEZOZoxX-5LYG0FJcB-n6HwPkVSd-ijpJDPbI4sBanWaFpUy0WbDbksaCgfuf18--UwCuSjUiXaIVIuRn8s54mkfxRFcpW8SVxug__&Key-Pair-Id=K38HBHX5LX3X2H';

const sections:Section[]=[
{key:'starters',label:'ЗАКУСКИ',active:true},
{key:'soups',label:'СУПЫ',active:false},
{key:'mains',label:'ГОРЯЧЕЕ',active:false},
{key:'desserts',label:'ДЕСЕРТЫ',active:false},
{key:'drinks',label:'НАПИТКИ',active:false},
{key:'service',label:'СЕРВИС',active:false}
];

const materials:Material[]=[
{id:1,title:'PATÉ DE HÍGADO DE POLLO',image:'/cards/01-chicken-liver-pate.jpg',body:'Hígado de pollo, cebolla y nata. Textura suave y cremosa.'},
{id:2,title:'PATÉ DE CABALLA AHUMADA',image:'/cards/02-mackerel-pate.jpg',body:'Caballa ahumada, nata agria, limón y cebollino. Cremoso, con fibras del pescado.'},
{id:3,title:'FORSHMAK',image:'/cards/03-forshmak.jpg',body:'Arenque en dos texturas, mantequilla, huevo y manzana.'},
{id:4,title:'SURTIDO DE TRES PATÉS',image:'/cards/04-three-pates.jpg',body:'Hígado de pollo, caballa ahumada y forshmak con pan de masa madre.'},
{id:5,title:'ROLLOS DE BERENJENA CON NUECES',image:'/cards/05-eggplant-rolls.jpg',body:'Berenjena, nueces, cebolla, cilantro, ajo y khmeli-suneli.'},
{id:6,title:'ENSALADA DE TRES TOMATES Y PEPINO',image:'/cards/06-tomato-cucumber.jpg',body:'Tomates de temporada, pepino, cebolla dulce y eneldo.'},
{id:7,title:'VERDADERA ENSALADA RUSA “OLIVJE”',image:'/cards/07-olivje.jpg',body:'Pollo, pepino fresco y fermentado, corte grande y menos mayonesa.'},
{id:8,title:'ARENQUE BAJO ABRIGO DE REMOLACHA “SHUBA”',image:'/cards/08-shuba.jpg',body:'Ensalada fría en capas con arenque y remolacha.'},
{id:9,title:'VINIGRET',image:'/cards/09-vinigret.jpg',body:'Remolacha, patata, zanahoria, chucrut y aceite de girasol aromático.'},
{id:10,title:'TOSTADA DE PAN DE CENTENO CON SALO',image:'/cards/10-salo.jpg',body:'Salo triturado con ajo y hierbas sobre pan de centeno.'},
{id:11,title:'ENCURTIDOS Y FERMENTADOS',image:'/cards/11-pickles.jpg',body:'Selección estacional de fermentados y marinados.'},
{id:12,title:'SETAS NAMEKO MARINADAS',image:'/cards/12-nameko.jpg',body:'Setas nameko marinadas con cebolla.'},
{id:13,title:'JOLODETS / ÁSPIC DE CARNE',image:'/cards/13-jolodets.jpg',body:'Cerdo y pollo, gelificación natural del caldo.'},
{id:14,title:'ENSALADA DE REMOLACHA Y QUESO DE CABRA',image:'/cards/14-beet-goat-cheese.jpg',body:'Hojas verdes, remolacha, queso de cabra, nueces y piñones.'},
{id:15,title:'HUEVOS RELLENOS CON ESPADINES AHUMADOS DE RIGA',image:'/cards/15-eggs-riga.jpg',body:'Huevos rellenos con espadines ahumados de Riga y pan de centeno.'}
];

export default function Materials(){
 const router=useRouter();
 const[ready,setReady]=useState(false);
 const[selected,setSelected]=useState('starters');
 const[activeCard,setActiveCard]=useState<Material|null>(null);
 useEffect(()=>{
  if(sessionStorage.getItem('volga_staff_access')!=='1'){router.replace('/');return}
  setReady(true);
 },[router]);
 if(!ready)return null;
 const current=sections.find(s=>s.key===selected)||sections[0];
 return <main>
  <div className="brand">VOLGA · COCINA DEL ESTE · ОБУЧЕНИЕ</div>
  <h1>УЧЕБНЫЕ МАТЕРИАЛЫ</h1>
  <p>Выбери раздел и повтори материал перед экзаменом.</p>
  <div className="sectionTabs">{sections.map(s=><button key={s.key} className={`sectionTab ${selected===s.key?'selected':''}`} disabled={!s.active} onClick={()=>s.active&&setSelected(s.key)}>{s.label}{!s.active&&<span className="comingSoon">СКОРО</span>}</button>)}</div>
  <div className="sectionHeader"><div><span className="sectionEyebrow">ТЕКУЩИЙ РАЗДЕЛ</span><h2>{current.label}</h2></div><span className="sectionCount">15 КАРТОЧЕК</span></div>

  {selected==='starters'&&<>
    <div className="card">
      <span className="sectionEyebrow">ВИДЕОУРОК</span>
      <h2>Закуски</h2>
      <SegmentVideo src={ENTRANTES_VIDEO} start={73} className="trainingVideo"/>
    </div>

    <div className="materialsGrid">{materials.map(m=><div className="card materialCard" key={m.id}>
      <button className="materialTitle" onClick={()=>setActiveCard(m)}>{m.title}<span>↗</span></button>
    </div>)}</div>
  </>}

  {activeCard&&<div className="cardModal" role="dialog" aria-modal="true" aria-label={activeCard.title} onClick={()=>setActiveCard(null)}>
    <button className="cardModalClose" onClick={()=>setActiveCard(null)} aria-label="Закрыть">×</button>
    <div className="cardModalInner" onClick={e=>e.stopPropagation()}>
      <img className="cardModalImage" src={activeCard.image} alt={activeCard.title}/>
    </div>
  </div>}

  <div className="card"><Link className="button" href="/">← НАЗАД</Link></div>
 </main>
}
