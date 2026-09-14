'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';

type Material={id:number;title:string;body:string};

type Section={key:string;label:string;active:boolean};

const sections:Section[]=[
{key:'starters',label:'ЗАКУСКИ',active:true},
{key:'soups',label:'СУПЫ',active:false},
{key:'mains',label:'ГОРЯЧЕЕ',active:false},
{key:'desserts',label:'ДЕСЕРТЫ',active:false},
{key:'drinks',label:'НАПИТКИ',active:false},
{key:'service',label:'СЕРВИС',active:false}
];

const fallback:Material[]=[
{id:1,title:'PATÉ DE HÍGADO DE POLLO',body:'Ingredientes: hígado de pollo, cebolla y nata. Textura suave y cremosa.\n\nQUÉ DECIR AL CLIENTE: Es un paté delicado de hígado de pollo con cebolla y nata, muy cremoso y de sabor equilibrado.\n\nOJO: no decir que lleva nata agria.'},
{id:2,title:'PATÉ DE CABALLA AHUMADA',body:'Caballa ahumada, nata agria, limón, cebollino y cebolla verde. Cremoso, pero conserva fibras naturales del pescado.'},
{id:3,title:'FORSHMAK',body:'Paté tradicional de arenque con dos texturas. Lleva huevo, manzana y mantequilla. Ideal con pan de centeno.'},
{id:4,title:'SURTIDO DE TRES PATÉS',body:'Hígado de pollo, caballa ahumada y forshmak. Se sirve con dos panes de trigo de masa madre y uno de centeno; el centeno es especialmente para el forshmak.'},
{id:5,title:'ROLLOS DE BERENJENA CON NUECES',body:'Berenjena frita fina, nueces, cebolla frita, cilantro, un poco de ajo y khmeli-suneli, una mezcla tradicional de especias del Cáucaso.'},
{id:6,title:'ENSALADA DE TRES TOMATES Y PEPINO',body:'Tres tomates de temporada, pepino, cebolla dulce y eneldo. Recomendación tradicional: aceite de girasol aromático.'},
{id:7,title:'VERDADERA ENSALADA RUSA “OLIVJE”',body:'Pollo, pepino fresco y pepino fermentado, corte más grande y menos mayonesa que una ensaladilla rusa española.'},
{id:8,title:'ARENQUE BAJO ABRIGO DE REMOLACHA “SHUBA”',body:'Ensalada fría por CAPAS: arenque, cebolla marinada, patata, zanahoria, huevo, remolacha y mayonesa.'},
{id:9,title:'VINIGRET',body:'Remolacha, patata, zanahoria, chucrut y aceite de girasol aromático. No es una salsa vinagreta.'},
{id:10,title:'TOSTADA DE PAN DE CENTENO CON SALO',body:'El salo va triturado con ajo y hierbas sobre pan de centeno; no se sirve en lonchas.'},
{id:11,title:'ENCURTIDOS Y FERMENTADOS',body:'Selección estacional: chucrut, col georgiana, pepinos y tomates ligeramente salados, zanahoria coreana, ajo silvestre y a veces kimchi de brócoli.'},
{id:12,title:'SETAS NAMEKO MARINADAS',body:'Setas nameko pequeñas marinadas con cebolla. En ruso se conocen como опята. No llamarlas simplemente champiñones.'},
{id:13,title:'JOLODETS / ÁSPIC DE CARNE',body:'Cerdo y pollo cocidos durante horas. La gelificación es natural por el colágeno del caldo. Se sirve frío con rábano picante y mostaza.'},
{id:14,title:'ENSALADA DE REMOLACHA Y QUESO DE CABRA',body:'Hojas verdes, remolacha, queso de cabra, nueces, piñones y aliño de miel y mostaza.'},
{id:15,title:'HUEVOS RELLENOS CON ESPADINES AHUMADOS DE RIGA',body:'Entrante frío de huevos rellenos con espadines ahumados de Riga, acompañado de pan de centeno.'}
];

export default function Materials(){
 const[items,setItems]=useState<Material[]>(fallback); const[open,setOpen]=useState<number|null>(1); const[selected,setSelected]=useState('starters');
 useEffect(()=>{fetch('/api/materials').then(r=>r.ok?r.json():Promise.reject()).then(d=>{if(Array.isArray(d)&&d.length)setItems(d)}).catch(()=>{})},[]);
 const current=sections.find(s=>s.key===selected) || sections[0];
 return <main>
   <div className="brand">VOLGA · COCINA DEL ESTE · TRAINING</div>
   <h1>УЧЕБНЫЕ МАТЕРИАЛЫ</h1>
   <p>Выбери раздел и повтори материал перед экзаменом.</p>
   <div className="sectionTabs">{sections.map(s=><button key={s.key} className={`sectionTab ${selected===s.key?'selected':''}`} disabled={!s.active} onClick={()=>s.active&&setSelected(s.key)}>{s.label}{!s.active&&<span className="comingSoon">СКОРО</span>}</button>)}</div>
   <div className="sectionHeader"><div><span className="sectionEyebrow">ТЕКУЩИЙ РАЗДЕЛ</span><h2>{current.label}</h2></div><span className="sectionCount">{items.length} КАРТОЧЕК</span></div>
   {selected==='starters'&&<><p className="small">Сейчас готовим раздел «Закуски». Полные визуальные карточки будут добавлены сюда вместо сокращённого текста.</p><div className="materialsGrid">{items.map(m=><div className="card materialCard" key={m.id}><button className="materialTitle" onClick={()=>setOpen(open===m.id?null:m.id)}>{m.title}<span>{open===m.id?'−':'+'}</span></button>{open===m.id&&<div className="materialBody">{m.body.split('\n').map((x,i)=><p key={i}>{x||' '}</p>)}</div>}</div>)}</div></>}
   <div className="card"><Link className="button" href="/">← НАЗАД</Link></div>
 </main>
}
