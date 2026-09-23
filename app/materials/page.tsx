'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import SegmentVideo from '../../components/SegmentVideo';

type Material={id:number;title:string;body:string;image:string;section:'starters'|'soups'|'mains'};
type Section={key:string;label:string;active:boolean};

const STORAGE='https://oswvsqryavzrqwbnjvbc.supabase.co/storage/v1/object/public/training-videos';
const ENTRANTES_VIDEO=`${STORAGE}/entrantes-training.mp4`;
const SOUPS_MAINS_VIDEO=`${STORAGE}/volga-soups-mains-training-final-under50mb.mp4`;

const sections:Section[]=[
{key:'starters',label:'ЗАКУСКИ',active:true},
{key:'soups',label:'СУПЫ',active:true},
{key:'mains',label:'ГОРЯЧЕЕ',active:true},
{key:'desserts',label:'ДЕСЕРТЫ',active:false},
{key:'drinks',label:'НАПИТКИ',active:false},
{key:'service',label:'СЕРВИС',active:false}
];

const materials:Material[]=[
{id:1,title:'PATÉ DE HÍGADO DE POLLO',image:'/cards/01-chicken-liver-pate.jpg',body:'Hígado de pollo, cebolla y nata. Textura suave y cremosa.',section:'starters'},
{id:2,title:'PATÉ DE CABALLA AHUMADA',image:'/cards/02-mackerel-pate.jpg',body:'Caballa ahumada, nata agria, limón y cebollino. Cremoso, con fibras del pescado.',section:'starters'},
{id:3,title:'FORSHMAK',image:'/cards/03-forshmak.jpg',body:'Arenque en dos texturas, mantequilla, huevo y manzana.',section:'starters'},
{id:4,title:'SURTIDO DE TRES PATÉS',image:'/cards/04-three-pates.jpg',body:'Hígado de pollo, caballa ahumada y forshmak con pan de masa madre.',section:'starters'},
{id:5,title:'ROLLOS DE BERENJENA CON NUECES',image:'/cards/05-eggplant-rolls.jpg',body:'Berenjena, nueces, cebolla, cilantro, ajo y khmeli-suneli.',section:'starters'},
{id:6,title:'ENSALADA DE TRES TOMATES Y PEPINO',image:'/cards/06-tomato-cucumber.jpg',body:'Tomates de temporada, pepino, cebolla dulce y eneldo.',section:'starters'},
{id:7,title:'VERDADERA ENSALADA RUSA “OLIVJE”',image:'/cards/07-olivje.jpg',body:'Pollo, pepino fresco y fermentado, corte grande y menos mayonesa.',section:'starters'},
{id:8,title:'ARENQUE BAJO ABRIGO DE REMOLACHA “SHUBA”',image:'/cards/08-shuba.jpg',body:'Ensalada fría en capas con arenque y remolacha.',section:'starters'},
{id:9,title:'VINIGRET',image:'/cards/09-vinigret.jpg',body:'Remolacha, patata, zanahoria, chucrut y aceite de girasol aromático.',section:'starters'},
{id:10,title:'TOSTADA DE PAN DE CENTENO CON SALO',image:'/cards/10-salo.jpg',body:'Salo triturado con ajo y hierbas sobre pan de centeno.',section:'starters'},
{id:11,title:'ENCURTIDOS Y FERMENTADOS',image:'/cards/11-pickles.jpg',body:'Selección estacional de fermentados y marinados.',section:'starters'},
{id:12,title:'SETAS NAMEKO MARINADAS',image:'/cards/12-nameko.jpg',body:'Setas nameko marinadas con cebolla.',section:'starters'},
{id:13,title:'JOLODETS / ÁSPIC DE CARNE',image:'/cards/13-jolodets.jpg',body:'Cerdo y pollo, gelificación natural del caldo.',section:'starters'},
{id:14,title:'ENSALADA DE REMOLACHA Y QUESO DE CABRA',image:'/cards/14-beet-goat-cheese.jpg',body:'Hojas verdes, remolacha, queso de cabra, nueces y piñones.',section:'starters'},
{id:15,title:'HUEVOS RELLENOS CON ESPADINES AHUMADOS DE RIGA',image:'/cards/15-eggs-riga.jpg',body:'Huevos rellenos con espadines ahumados de Riga y pan de centeno.',section:'starters'},
{id:16,title:'BORSCH',image:'/cards/16-borsch.jpg',body:'Caldo de ternera, remolacha, col, panceta ahumada y ciruelas pasas. Sin patata.',section:'soups'},
{id:17,title:'SOLYANKA DE CARNE',image:'/cards/17-solyanka.jpg',body:'Caldo de ternera, embutidos, pepinos salados, tomate, aceitunas, alcaparras y limón.',section:'soups'},
{id:18,title:'SOPA DE POLLO CON FIDEOS DE HUEVO',image:'/cards/18-chicken-soup.jpg',body:'Caldo de pollo intenso, fideos de huevo gruesos, huevo cocido y hierbas.',section:'soups'},
{id:19,title:'PLOV CHAIKHANA',image:'/cards/19-plov-chaikhana.jpg',body:'Plov uzbeko de cordero con arroz basmati, comino y ensalada achichuk.',section:'mains'},
{id:20,title:'BEEF STROGANOFF',image:'/cards/20-beef-stroganoff.jpg',body:'Steak de ternera con salsa cremosa de setas, puré y pepino ligeramente salado.',section:'mains'},
{id:21,title:'ESTURIÓN SOUS-VIDE',image:'/cards/21-sturgeon-sous-vide.jpg',body:'Esturión local sous-vide con puré, chirivía, guisantes y brócoli.',section:'mains'},
{id:22,title:'FILETE RUSO DE POLLO',image:'/cards/22-filete-ruso-pollo.jpg',body:'Kotleta de pollo de pechuga y muslo, tierna y jugosa, con puré y pepino.',section:'mains'},
{id:23,title:'DRANIKI',image:'/cards/23-draniki.jpg',body:'Tortitas de patata rallada y cebolla, con salsa de setas o salmón ligeramente salado.',section:'mains'}
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
 const currentMaterials=materials.filter(m=>m.section===selected);
 return <main>
  <div className="brand">VOLGA · COCINA DEL ESTE · ОБУЧЕНИЕ</div>
  <h1>УЧЕБНЫЕ МАТЕРИАЛЫ</h1>
  <p>Выбери раздел и повтори материал перед экзаменом.</p>
  <div className="sectionTabs">{sections.map(s=><button key={s.key} className={`sectionTab ${selected===s.key?'selected':''}`} disabled={!s.active} onClick={()=>s.active&&setSelected(s.key)}>{s.label}{!s.active&&<span className="comingSoon">СКОРО</span>}</button>)}</div>
  <div className="sectionHeader"><div><span className="sectionEyebrow">ТЕКУЩИЙ РАЗДЕЛ</span><h2>{current.label}</h2></div><span className="sectionCount">{currentMaterials.length} КАРТОЧЕК</span></div>

  {selected==='starters'&&<div className="card">
    <span className="sectionEyebrow">ВИДЕОУРОК</span>
    <h2>Закуски</h2>
    <SegmentVideo src={ENTRANTES_VIDEO} start={73} className="trainingVideo"/>
  </div>}

  {(selected==='soups'||selected==='mains')&&<div className="card">
    <span className="sectionEyebrow">ВИДЕОУРОК</span>
    <h2>Супы и горячие блюда</h2>
    <SegmentVideo src={SOUPS_MAINS_VIDEO} className="trainingVideo"/>
  </div>}

  <div className="materialsGrid">{currentMaterials.map(m=><div className="card materialCard" key={m.id}>
    <button className="materialTitle" onClick={()=>setActiveCard(m)}>{m.title}<span>↗</span></button>
  </div>)}</div>

  {activeCard&&<div className="cardModal" role="dialog" aria-modal="true" aria-label={activeCard.title} onClick={()=>setActiveCard(null)}>
    <button className="cardModalClose" onClick={()=>setActiveCard(null)} aria-label="Закрыть">×</button>
    <div className="cardModalInner" onClick={e=>e.stopPropagation()}>
      <img className="cardModalImage" src={`${activeCard.image}?v=20260923-2`} alt={activeCard.title}/>
    </div>
  </div>}

  <div className="card"><Link className="button" href="/">← НАЗАД</Link></div>
 </main>
}
