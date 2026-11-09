/* Artistic reconstruction: the previous F1–F3 anatomy was NOT approved.
   New painted parts are registered against the actual plush photographs. */
(() => {
 const freeze=o=>{Object.values(o).forEach(v=>{if(v&&typeof v==='object')freeze(v)});return Object.freeze(o)};
 const palettes={pink:['#fff0f6','#f0bed0','#bd8298'],ivory:['#fff8ef','#eee4de','#c4adaa'],taupe:['#e0d9ce','#b4a597','#756659']};
 const BOUNDS={pink:{x:-133,y:-391,w:266,h:417},taupe:{x:-182,y:-298,w:364,h:328}};
 const models={
  pink:{id:'pink',label:'Conejito rosa',reference:'image(20261027-023349).png',palette:palettes.pink,envelope:BOUNDS.pink,headPivot:{x:0,y:-199},headBox:{x:-92,y:-270,w:184,h:154},earRoots:[[-34,-257],[44,-256]],shoulder:{x:27,y:-124},arm:[34,37],footX:26,footWidth:.70,earFrequency:12,earDamping:.72,eyes:[[-44.45,-191.96],[43.42,-184.68]],identity:['reference face and protruding ivory muzzle','small black bead eyes','two upright ears with natural asymmetric height','pink torso without invented white bib']},
  taupe:{id:'taupe',label:'Conejito beige',reference:'image(20261027-023411).png',palette:palettes.taupe,envelope:BOUNDS.taupe,headPivot:{x:0,y:-205},headBox:{x:-98,y:-277,w:196,h:147},earRoots:[[-82,-259],[82,-259]],shoulder:{x:36,y:-126},arm:[42,45],footX:34,footWidth:.82,earFrequency:8,earDamping:.56,eyes:[[-33,-205],[36,-204]],identity:['warm taupe shaggy pile','soft broad oval head','heavy ears hanging below chin','small downward pink nose','no white muzzle or invented smile']}
 };
 const crops={
  taupe:{head:[0,52,451,386],body:[452,0,446,468],earLeft:[926,0,328,478],earRight:[21,463,365,478],upper:[491,478,294,448],fore:[905,478,306,427],pawLeft:[59,944,324,289],pawRight:[422,942,380,296],foot:[843,903,411,340]},
  pink:{head:[0,90,463,412],body:[464,20,435,523],earLeft:[873,0,381,556],earRight:[72,559,355,391],upper:[492,542,280,420],fore:[905,566,286,400],pawLeft:[87,966,291,274],pawRight:[487,978,266,263],foot:[877,963,354,283]}
 };
 VF.CharacterModels=freeze(models);VF.rigBounds=freeze(BOUNDS);
 VF.CharacterLibrary={palettes:freeze(palettes),crops:freeze(crops),bake(A){
  for(const id of ['pink','taupe']){
   const img=VF.Art.image(id),c=crops[id],m=models[id],add=(key,rect,box,options)=>A.addImage(id+'-'+key,img,rect,box,options);
   add('head',c.head,m.headBox);
   add('body',c.body,id==='pink'?{x:-74,y:-145,w:148,h:153}:{x:-87,y:-159,w:174,h:178});
   add('upper',c.upper,{x:-19,y:-10,w:38,h:70});add('fore',c.fore,{x:-20,y:-10,w:40,h:70});
   add('paw-left',c.pawLeft,{x:-23,y:-21,w:46,h:44});add('paw-right',c.pawRight,{x:-23,y:-21,w:46,h:44});
   add('foot',c.foot,{x:-43,y:-25,w:86,h:53});
   add('ear-left',id==='pink'?c.earLeft:c.earRight,id==='pink'?{x:-28,y:-128,w:56,h:138}:{x:-48,y:-3,w:62,h:221},id==='pink'?{upright:true}:undefined);
   add('ear-right',id==='pink'?c.earRight:c.earLeft,id==='pink'?{x:-30,y:-87,w:60,h:97}:{x:-18,y:-3,w:62,h:221},id==='pink'?{upright:true}:undefined);
  }
 },model(id){const key=id==='beige'?'taupe':id;if(!models[key])throw new Error('Unknown plush model: '+id);return models[key];}};
})();
