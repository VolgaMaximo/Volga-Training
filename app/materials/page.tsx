'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import SegmentVideo from '../../components/SegmentVideo';
import CheatSheet from '../../components/CheatSheet';

type Material={id:number;title:string;body:string;image:string;section:'starters'|'soups'|'mains'|'seasonal'};
type Section={key:string;label:string;active:boolean};

const STORAGE='https://oswvsqryavzrqwbnjvbc.supabase.co/storage/v1/object/public/training-videos';
const ENTRANTES_VIDEO=`${STORAGE}/entrantes-training.mp4?v=20260923-3`;
const SOUPS_MAINS_VIDEO=`${STORAGE}/volga-soups-mains-training-final-under50mb.mp4?v=20260923-3`;
const SEASONAL_VIDEO=`${STORAGE}/seasonal-autumn-2026.mp4?v=20261007-1`;

const sections:Section[]=[
{key:'starters',label:'ЗАКУСКИ',active:true},
{key:'soups',label:'СУПЫ',active:true},
{key:'mains',label:'ГОРЯЧЕЕ',active:true},
{key:'seasonal',label:'СЕЗОННОЕ МЕНЮ',active:true},
{key:'desserts',label:'ДЕСЕРТЫ',active:false},
{key:'drinks',label:'НАПИТКИ',active:false},
{key:'service',label:'СЕРВИС',active:false},
{key:'cheatsheet',label:'ШПАРГАЛКА',active:true}
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
{id:23,title:'DRANIKI',image:'/cards/23-draniki.jpg',body:'Tortitas de patata rallada y cebolla, con salsa de setas o salmón ligeramente salado.',section:'mains'},
{id:24,title:'KHARCHO CON ARROZ BOMBA',image:'/cards/24-kharcho.jpg',body:'Sopa georgiana intensa con carne, especias, acidez y arroz bomba valenciano.',section:'seasonal'},
{id:25,title:'UJÁ DE CARELIA CON SALMÓN',image:'/cards/25-ukha.jpg',body:'Sopa de pescado de Carelia con salmón, patata, zanahoria, nata y hierbas frescas.',section:'seasonal'},
{id:26,title:'LENGUA DE TERNERA AL ESTILO VITELLO TONNATO',image:'/cards/26-beef-tongue-vitello-tonnato.jpg',body:'Lengua tierna con salsa inspirada en vitello tonnato a base de espadines ahumados.',section:'seasonal'},
{id:27,title:'BERENJENA GARNI YARAKH',image:'/cards/27-garni-yarakh.jpg',body:'Berenjena rellena al estilo armenio.',section:'seasonal'},
{id:28,title:'KURZE DE DAGUESTÁN',image:'/cards/28-kurze.jpg',body:'Ravioli de Daguestán rellenos de cordero y ternera.',section:'seasonal'},
{id:29,title:'MUSLO DE PATO SOUS-VIDE',image:'/cards/29-duck-sous-vide.jpg',body:'Pato sous-vide con puré de calabaza especiado, cebolla caramelizada y salsa de vino con arándanos rojos.',section:'seasonal'},
{id:30,title:'JABALÍ EN CERVEZA NEGRA',image:'/cards/30-wild-boar.jpg',body:'Jabalí con cerveza negra, frutos del bosque y trigo sarraceno.',section:'seasonal'},
{id:31,title:'COSTILLA DE CERDO CON DEMI-GLACE',image:'/cards/31-pork-ribs.jpg',body:'Costilla de cerdo con demi-glace casero y patatas baby.',section:'seasonal'},
{id:32,title:'ROLLITO DE COL CON SALMÓN Y DORADA',image:'/cards/32-fish-cabbage-rolls.jpg',body:'Rollito de col con salmón y dorada, sin arroz, servido con salsa de fumet.',section:'seasonal'},
{id:33,title:'RISOTTO DE PATATA CON SETAS',image:'/cards/33-potato-risotto.jpg',body:'Risotto de patata — sin arroz — con setas.',section:'seasonal'},
{id:34,title:'ROLLO DE MERENGUE CON ESPINO AMARILLO',image:'/cards/34-meringue-sea-buckthorn.jpg',body:'Merengue aireado con crema de queso y espino amarillo.',section:'seasonal'}
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
  {selected!=='cheatsheet'&&<div className="sectionHeader"><div><span className="sectionEyebrow">ТЕКУЩИЙ РАЗДЕЛ</span><h2>{current.label}</h2></div><span className="sectionCount">{currentMaterials.length} КАРТОЧЕК</span></div>}
  {selected==='cheatsheet'&&<div className="sectionHeader"><div><span className="sectionEyebrow">ПОДГОТОВКА К УСТНОЙ ЧАСТИ</span><h2>ШПАРГАЛКА</h2></div></div>}

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

  {selected==='seasonal'&&<div className="card">
    <span className="sectionEyebrow">СЕЗОННОЕ МЕНЮ · ОСЕНЬ 2026</span>
    <h2>Осень фантазий</h2>
    <p>Видео сначала: Мила разбирает блюда, акценты для гостя и полезные детали для продажи. Ниже — карточки в том же порядке.</p>
    <SegmentVideo src={SEASONAL_VIDEO} className="trainingVideo"/>
  </div>}

  {selected==='cheatsheet'?<CheatSheet/>:<div className="materialsGrid">{currentMaterials.map(m=><div className="card materialCard" key={m.id}>
    <button className="materialTitle" onClick={()=>setActiveCard(m)}>{m.title}<span>↗</span></button>
  </div>)}</div>}

  {activeCard&&<div className="cardModal" role="dialog" aria-modal="true" aria-label={activeCard.title} onClick={()=>setActiveCard(null)}>
    <button className="cardModalClose" onClick={()=>setActiveCard(null)} aria-label="Закрыть">×</button>
    <div className="cardModalInner" onClick={e=>e.stopPropagation()}>
      <img className="cardModalImage" src={`${activeCard.image}?v=20261007-1`} alt={activeCard.title}/>
    </div>
  </div>}

  <div className="card"><Link className="button" href="/">← НАЗАД</Link></div>
 </main>
}
