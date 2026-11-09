/* Personal content retained exactly from RC07. Edit the letter here. */
VF.content.letter=[{"title": "Volver a encontrarnos.", "text": "Valerie,\n\nFuimos parte de la vida del otro. Después, cada uno siguió su camino. Hoy me ilusiona conocerte otra vez, con todo lo que somos ahora."}, {"title": "Con más calma.", "text": "No quiero prometerte una historia perfecta. Quiero ofrecerte algo más real: cariño, cuidado, risas y paciencia. Escucharnos. Elegirnos bien. Darnos espacio para ser."}, {"title": "Y con intención.", "text": "Hice este pequeño mundo pensando en las cosas que te gustan: los viñedos, los conejitos, la noche y las rosas. Carácter por carácter, encontré una manera de decirte que me gustaría escribir nuevas páginas contigo."}];
VF.content.signature="Con todo mi cariño.";
VF.content.memories={"0": {"file": "assets/memories/07_retrato.webp", "mime": "image/webp", "sha256": "f9485c7ee6ea331d972c672e53ec2b671a2c38fd82095c4f689cadd45f3164bb", "source": "legacy\\rc07\\memories\\07_retrato\\index.html", "privacy": "Local only; exact original embedded bytes"}, "1": {"file": "assets/memories/08_dos_sonrisas.jpeg", "mime": "image/jpeg", "sha256": "aad948e5ad1e0715b475f836c0b876882eda15974ffc515119258caa28f68682", "source": "legacy\\rc07\\memories\\08_dos_sonrisas\\index.html", "privacy": "Local only; exact original embedded bytes"}, "2": {"file": "assets/memories/09_un_instante.png", "mime": "image/png", "sha256": "51c9b8cc9e18f49ca7c99576759733cc29a3c14713ad4ef1f4c83bcf8ebf7952", "source": "legacy\\rc07\\memories\\09_un_instante\\index.html", "privacy": "Local only; exact original embedded bytes"}};
VF.content.shots.push(
{"id": "nuestro-retrato", "title": "Nuestro retrato", "line": "Dos personas. Un perrito. Un recuerdo que vuelve a tomar forma.", "action": "Contemplar el recuerdo", "mode": "memory", "memory": 0, "world": "memory", "biome": 0, "hold": 16},
{"id": "dos-sonrisas", "title": "Dos sonrisas", "line": "Hay cosas que una imagen sabe decir sin palabras.", "action": "Acercar el recuerdo", "mode": "memory", "memory": 1, "world": "memory", "biome": 0, "hold": 16},
{"id": "un-instante", "title": "Un instante", "line": "No para quedarnos en el pasado. Para llevar con cariño lo que fue nuestro.", "action": "Quedarse aquí", "mode": "memory", "memory": 2, "world": "memory", "biome": 0, "hold": 16},
{"id": "una-carta-para-ti", "title": "Una carta para ti", "line": "Lo que quiero decirte.", "action": "Leer con calma", "mode": "letter", "world": "letter", "biome": 0, "hold": 16}
);

VF.content.surprise={ringPlacement:{x:.15,y:.25,z:.05,confirmed:false},banners:['QUIERES','SER MI','NOVIA?'],question:['Valerie,','¿quieres ser mi novia?']};
VF.content.shots.push(
 {id:'la-caja-rosa',title:'La caja rosa',line:'El camino nos trajo de vuelta. Había algo esperándote aquí.',action:'Acercar la luz',mode:'case',world:'ceremony',biome:0,hold:16},
 {id:'algo-que-guarde',title:'Algo que guardé',line:'Dos pequeños cómplices. Una sorpresa. Y algo que quiero preguntarte.',action:'Contemplar la sorpresa',mode:'ceremony',world:'ceremony',biome:0,hold:17},
 {id:'una-nueva-pagina',title:'Una nueva página',line:'La historia sigue aquí, contigo.',action:'Volver a contemplar',mode:'finale',world:'finale',biome:0,hold:17}
);

VF.content.futureSurprise.phase='Implemented F6; artistic review pending';
