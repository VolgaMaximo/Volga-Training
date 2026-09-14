export type QuizQuestion={id:string;question:string;options:string[];correct:number};

export const quizQuestions:QuizQuestion[]=[
{id:'q1',question:'¿Qué diferencia clave tiene nuestra ensalada rusa “olivje” frente a la ensaladilla rusa española?',options:['Lleva atún y más mayonesa','Lleva pollo, pepino fresco y fermentado, corte más grande y menos mayonesa','No lleva patata','Se sirve caliente'],correct:1},
{id:'q2',question:'¿Qué hay que explicar sobre el forshmak?',options:['Es un paté completamente liso','Es de salmón ahumado','El arenque aparece en dos texturas y lleva mantequilla, huevo y manzana','Es vegetariano'],correct:2},
{id:'q3',question:'¿Qué aliño recomendamos para el sabor más tradicional de la ensalada de tres tomates y pepino?',options:['Aceite de girasol aromático','Mayonesa','Vinagre balsámico','Solo nata agria'],correct:0},
{id:'q4',question:'¿Qué es khmeli-suneli?',options:['Un queso georgiano','Una mezcla tradicional de especias del Cáucaso','Una salsa de yogur','Un tipo de berenjena'],correct:1},
{id:'q5',question:'¿Qué NO debemos decir del jolodets?',options:['Se sirve frío','Lleva cerdo y pollo','La gelatina es natural del propio caldo','Se hace con gelatina de postre añadida'],correct:3},
{id:'q6',question:'¿Cómo se sirve el salo en la tostada?',options:['En lonchas gruesas','Triturado y mezclado con ajo y hierbas','Frito','Con miel'],correct:1},
{id:'q7',question:'¿Cómo llamamos el pan al explicárselo al cliente?',options:['Pan negro','Pan de centeno','Pan dulce','Pan blanco'],correct:1},
{id:'q8',question:'¿Qué debe saber el equipo sobre los encurtidos y fermentados?',options:['Siempre llevan exactamente lo mismo','Todo está hecho solo con vinagre','La selección puede variar según la temporada','Nunca incluyen kimchi'],correct:2},
{id:'q9',question:'¿Qué dos frutos secos concretos lleva la ensalada de remolacha y queso de cabra?',options:['Almendras y pistachos','Nueces y piñones','Avellanas y nueces','Piñones y cacahuetes'],correct:1},
{id:'q10',question:'¿Qué caracteriza la textura del paté de caballa ahumada?',options:['Totalmente lisa y homogénea','Crujiente','Suave y cremosa, pero conserva fibras de la caballa','Gelatinosa'],correct:2},
{id:'q11',question:'¿Qué palabra es especialmente útil para explicar la Shuba?',options:['CAPAS','PICANTE','FRITO','DULCE'],correct:0},
{id:'q12',question:'¿Qué debemos decir si preguntan si hacemos el pan nosotros?',options:['Sí, todo se hornea en VOLGA','No; trabajamos con dos panaderías artesanas que usan masa madre y fermentaciones largas','No sabemos','El pan es industrial congelado'],correct:1},
{id:'q13',question:'¿Qué lleva el paté de hígado de pollo?',options:['Hígado de pollo, cebolla y nata agria','Hígado de cerdo y mantequilla','Pollo asado y queso','Hígado de pollo y tomate'],correct:0},
{id:'q14',question:'¿Cómo se sirve la versión actual de los espadines ahumados de Riga?',options:['Solos sobre pan','En huevos rellenos sobre pan de centeno','Con pasta','En sopa'],correct:1},
{id:'q15',question:'¿Qué nombre ruso usamos para las setas nameko?',options:['Boletus','Champiñones','Opята / opiata','Shiitake'],correct:2}
];

export const oralScenarios=[
'Un cliente dice: «Nunca he probado el forshmak. ¿Qué es?» Explícalo de forma natural y breve.',
'Un cliente español pregunta: «¿Esto es como una ensaladilla rusa normal?» Responde sobre nuestra Olivje.',
'Un cliente pregunta: «¿Qué es khmeli-suneli?» Responde y explica brevemente los rollos de berenjena.',
'Un cliente dice: «No me gusta mucho el hígado. ¿Este paté sabe muy fuerte?» Responde.',
'Un cliente pregunta: «¿El jolodets lleva gelatina añadida?» Responde claramente.',
'Un cliente pregunta: «¿Qué diferencia hay entre encurtido y fermentado en vuestro plato?» Responde.',
'Un cliente pregunta: «¿Qué aliño me recomiendas para la ensalada de tomate?» Responde.',
'Un cliente pregunta: «¿Estas setas son champiñones?» Responde sobre las nameko.',
'Un cliente pregunta: «¿Qué es la Shuba?» Explícala usando una comparación comprensible.',
'Un cliente pregunta: «¿El pan lo hacéis vosotros?» Responde correctamente.',
'Un cliente pregunta: «¿Qué tiene de especial el paté de caballa?» Responde.',
'Un cliente pregunta: «¿Qué lleva la ensalada de remolacha y queso de cabra?» Incluye los frutos secos.',
'Un cliente pregunta: «¿Cómo se sirve el salo?» Responde sin crear la imagen de una loncha de grasa.',
'Un cliente pregunta: «¿Qué llevan los huevos rellenos con espadines de Riga?» Responde.',
'Un cliente dice: «Quiero probar varios sabores, ¿qué me recomiendas?» Recomienda el surtido de tres patés y explica el pan.'
];
