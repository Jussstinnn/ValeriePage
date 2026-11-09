/* Personalizable. No fecha, lugar ni anécdota que no figure en el material aportado. */
window.VStory = {
  signature: 'Con todo mi cariño.',
  audioFile: '', // Archivo local autorizado, por ejemplo assets/audio/nuestra-cancion.mp3.
  letter: [
    { title: 'Volver a encontrarnos.', text: 'Valerie,\n\nFuimos parte de la vida del otro. Después, cada uno siguió su camino. Hoy me ilusiona conocerte otra vez, con todo lo que somos ahora.' },
    { title: 'Con más calma.', text: 'No quiero prometerte una historia perfecta. Quiero ofrecerte algo más real: cariño, cuidado, risas y paciencia. Escucharnos. Elegirnos bien. Darnos espacio para ser.' },
    { title: 'Y con intención.', text: 'Hice este pequeño mundo pensando en las cosas que te gustan: los viñedos, los conejitos, la noche y los lirios. Carácter por carácter, encontré una manera de decirte que me gustaría escribir nuevas páginas contigo.' }
  ],
  chapters: [
    { id:'vineyard', name:'Sigue esa luz.', short:'El viñedo', act:'Un camino entre viñedos', duration:27, engineDuration:18, focus:7, transition:'meteor', line:'Imaginé que empezaríamos aquí. Entre viñedos, cuando el día deja sitio a las estrellas.', action:'Pedir una estrella', hint:'Toca el cielo. Hay alguien esperando al final del camino.', color:'#c9bc92', layout:'landscape' },
    { id:'rabbit', name:'Te estaba esperando.', short:'El conejito', act:'Un compañero de camino', duration:25, engineDuration:16, focus:7, transition:'trail', line:'Le conté que te gustan los conejitos. Y quiso ser él quien te acompañara.', action:'Saludar al conejito', hint:'Puedes acercarte. Tiene una pequeña luz que mostrarte.', color:'#bbc8b1', layout:'portrait' },
    { id:'mushroom', name:'Un secreto pequeño.', short:'El bosque', act:'Al otro lado del sendero', duration:25, engineDuration:16, focus:7, transition:'firefly', line:'El camino termina donde las cosas pequeñas se atreven a brillar.', action:'Despertar el bosque', hint:'Toca el bosque. La luz todavía tiene algo que enseñarte.', color:'#d7aca2', layout:'forest' },
    { id:'museum', name:'Una noche pintada', short:'El museo', act:'La luz se vuelve pintura', duration:23, engineDuration:19, focus:10, transition:'swirl', line:'La pequeña luz nos trajo hasta aquí. A una noche en la que podemos entrar juntos.', action:'Iluminar el cuadro', hint:'Toca la pintura para encender un destello.', color:'#b5c3da', layout:'gallery' },
    { id:'couple', name:'El mismo cielo', short:'Las estrellas', act:'Y la noche nos encuentra', duration:22, engineDuration:18, focus:8, transition:'constellation', line:'Somos distintos a quienes fuimos. Y me emociona imaginar lo que podemos vivir ahora.', action:'Compartir un deseo', hint:'Un deseo bajo el mismo cielo.', color:'#c7bdd8', layout:'landscape' },
    { id:'lily', name:'Volver a florecer', short:'Los lirios', act:'Algo empieza a crecer', duration:27, engineDuration:9.1, focus:4.2, transition:'petals', line:'Catorce lirios. Once capullos. Y las ganas de cuidar lo que empieza a crecer.', action:'Contemplar el ramo', hint:'El ramo necesita su tiempo. Tú también puedes tomar el tuyo.', color:'#dcbbcb', layout:'bouquet' },
    { id:'memory07', name:'Nuestro retrato', short:'El retrato', act:'Lo que llevamos con nosotros', duration:0, engineDuration:12, focus:4, transition:'develop', line:'Dos personas. Un perrito. Un recuerdo que vuelve a tomar forma.', action:'Dar vida al recuerdo', hint:'Un recuerdo vivo. Tócalo y quédate cuanto quieras.', color:'#d8b5bc', layout:'memory', source:'07_retrato' },
    { id:'memory08', name:'Dos sonrisas', short:'Dos sonrisas', act:'Lo que llevamos con nosotros', duration:0, engineDuration:11.8, focus:4, transition:'develop', line:'Hay cosas que una imagen sabe decir sin palabras.', action:'Dar vida al recuerdo', hint:'La imagen sigue aquí. Sin prisa.', color:'#d8b5bc', layout:'memory', source:'08_dos_sonrisas' },
    { id:'memory09', name:'Un instante', short:'Un instante', act:'Lo que llevamos con nosotros', duration:0, engineDuration:12, focus:4, transition:'ink', line:'No para quedarnos en el pasado. Para llevar con cariño lo que fue nuestro.', action:'Dar vida al recuerdo', hint:'Una pequeña parte de lo vivido.', color:'#d8b5bc', layout:'memory', source:'09_un_instante' },
    { id:'letter', name:'Lo que quiero decirte', short:'La carta', act:'Una carta para ti', duration:0, transition:'fold', color:'#d8beb3' },
    { id:'ring', name:'Algo que guardé', short:'La cajita', act:'Una pequeña sorpresa', duration:0, transition:'iris', color:'#dbbdad' },
    { id:'finale', name:'Una nueva página', short:'La última página', act:'La historia sigue afuera', duration:0, transition:'constellation', color:'#d6c9bb' }
  ]
};
// Important messages are reader-held even when the short worlds flow automatically.
window.VStory.chapters.forEach((chapter,index)=>{
 chapter.editorial={kind:index<4?'brief':index<9?'important':index===9?'letter':index===11?'question':'ceremony',persist:true,autoAdvance:index<4,minSeconds:Math.max(chapter.duration||0,8+(chapter.line||'').split(' ').length/2.4),...chapter.editorial};
});
window.VStory.gardenDedications=[
 'Que lo bonito crezca sin prisa.',
 'Que siempre haya espacio para escucharnos.',
 'Elegirnos también en los días sencillos.',
 'Compartir la calma. Y también la risa.',
 'Cuidar los detalles pequeños.',
 'Poder ser nosotros, con libertad.',
 'Hacer sitio para lo que viene.',
 'Conocerte otra vez, sin dar nada por hecho.',
 'Que el cariño se note en lo cotidiano.',
 'Acompañarnos sin dejar de ser quienes somos.',
 'Aprender a decirnos las cosas con cuidado.',
 'Encontrar nuevos motivos para sonreír.',
 'Estar presentes. De verdad.',
 'Volver a florecer, a nuestro ritmo.'
];
['Puedes arrastrar la luz.','Acerca la luz al conejito.','Lleva la luz hasta el bosque.','La pintura responde a la luz.','Un deseo puede dejar su forma.','Toca una flor o acerca la luz.'].forEach((hint,i)=>{window.VStory.chapters[i].hint=hint});
window.VStory.chapters[5].action='Descubrir un lirio';

window.VStory.title='Valerie — El mundo que te espera';
window.VStory.questionLines=['Valerie,','¿quieres ser','mi novia?'];


window.VStory.observatory=['Una estrella que encontró el camino.','Un compañero que supo esperar.','La luz de las cosas pequeñas.','Una noche a la que pudimos entrar.','Un deseo bajo el mismo cielo.','Algo que vuelve a florecer.'];

window.VStory.endingPortrait=['Valerie,','¿quieres','ser mi','novia?'];
window.VStory.endingLandscape=['Valerie,','¿quieres ser mi novia?'];
