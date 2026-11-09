/* Three tangible story objects, earned by actions, never by an elapsed-time reward. */
(() => {
 const spriteBounds=[[66, 30, 383, 452], [561, 14, 401, 498], [1037, 20, 475, 450], [16, 515, 463, 462], [522, 512, 502, 482], [1024, 545, 497, 416]];
 const allowed={forest:['firefly','tree','neutral'],sky:['paint','constellation'],garden:['petal','flower']},sources={forest:'forest-crossing',sky:'artwork-finished',garden:'garden-picked'};
 function sanitize(raw){const out={};for(const key of Object.keys(allowed)){const a=raw?.[key];if(a?.earned===true&&allowed[key].includes(a.variant)&&a.source===sources[key])out[key]={earned:true,variant:a.variant,source:a.source};}return out;}
 class RelicJourney{
  constructor(session){this.session=session;session.relics=sanitize(session.relics);}
  collect(key,variant){if(!allowed[key]?.includes(variant))return false;const old=this.session.relics[key];if(old?.variant===variant)return false;this.session.relics[key]={earned:true,variant,source:sources[key]};return true;}
  forest(snapshot){if(snapshot?.phase!=='rest'||!(snapshot.progress?.discover>=.999)||!(snapshot.progress?.shape>=.999))return false;return this.collect('forest',snapshot.route);}
  invalidate(key){delete this.session.relics[key];for(const id of ['algo-que-guarde:opening','algo-que-guarde:unveil'])delete this.session.gestures[id];this.session.ceremony.complete=false;delete this.session.narrative['algo-que-guarde'];}
  state(){return{items:sanitize(this.session.relics),complete:Object.keys(sanitize(this.session.relics)).length===3,missing:Object.keys(allowed).filter(k=>!this.session.relics[k])};}
  // Recover only demonstrably completed interactions. A visit or dialogue is never a reward.
  static recover(session){const out=sanitize(session.relics),forest=session.actions?.chapters?.['el-bosque-escucha'],painting=session.painting,dig=session.dig;
   if(!out.forest&&forest?.phase==='rest'&&forest.progress?.discover>=.999&&forest.progress?.shape>=.999&&allowed.forest.includes(forest.route))out.forest={earned:true,variant:forest.route,source:sources.forest};
   if(!out.sky&&painting?.complete===true&&allowed.sky.includes(painting.mode))out.sky={earned:true,variant:painting.mode,source:sources.sky};
   const choice=session.story?.choices?.['garden-gift'];if(!out.garden&&((dig?.version===2&&dig.phase===4)||(dig?.version===1&&dig.cycles>=8))&&allowed.garden.includes(choice))out.garden={earned:true,variant:choice,source:sources.garden};
   return out;
  }
  static sanitize(raw){return sanitize(raw);}
 }
 function draw(p,key,variant,x,y,size,painting,alpha=1,mode='relic'){const im=VF.JourneyAssets.peek('relics');if(!im)return;const cell=key==='forest'?(variant==='tree'?1:0):key==='sky'?2:variant==='flower'?4:3,cw=im.naturalWidth/3,ch=im.naturalHeight/2;p.save();p.globalAlpha=alpha;if(key==='garden'&&mode!=='decoration'){p.save();p.translate(x,y+size*.22);const g=p.createLinearGradient(0,-size*.15,0,size*.22);g.addColorStop(0,'#d4ba85');g.addColorStop(1,'#8e7551');p.fillStyle=g;p.strokeStyle='#e4cba0';p.lineWidth=Math.max(1,size*.015);p.beginPath();p.moveTo(-size*.29,-size*.09);p.quadraticCurveTo(0,-size*.20,size*.29,-size*.09);p.lineTo(size*.22,size*.20);p.quadraticCurveTo(0,size*.29,-size*.22,size*.20);p.closePath();p.fill();p.stroke();for(let i=0;i<4;i++){p.strokeStyle=i%2?'#a18b62':'#eddbb1';p.beginPath();p.moveTo(-size*.24,size*(i*.055-.03));p.quadraticCurveTo(0,size*(i*.055+.04),size*.24,size*(i*.055-.03));p.stroke();}p.restore();}const rect=spriteBounds[cell],scale=size/Math.max(rect[2],rect[3]);p.drawImage(im,rect[0],rect[1],rect[2],rect[3],x-rect[2]*scale/2,y-rect[3]*scale/2,rect[2]*scale,rect[3]*scale);p.restore();
  if(key==='sky'&&painting){p.save();p.translate(x-size*.19,y-size*.18);p.scale(size*.38,size*.38);p.strokeStyle='#77502c';p.lineWidth=.025;p.lineCap=p.lineJoin='round';if(variant==='constellation'){for(const path of VF.PaintingPaths){p.beginPath();path.forEach((a,i)=>i?p.lineTo(a[0],a[1]):p.moveTo(a[0],a[1]));p.stroke();}}else for(const line of painting.strokes||[]){p.beginPath();line.forEach((a,i)=>i?p.lineTo(a.x,a.y):p.moveTo(a.x,a.y));p.stroke();}p.restore();}
 }
 function carry(p,s,v,ledger,painting){if(s.relicHarvest||['photo','read','question'].includes(s.guardian?.view)||s.ceremony||s.sceneStage==='garden'||s.chapter==='finale')return;const actors=s.renderedActors||[],items=ledger.items;for(const [key,id,side]of [['forest','taupe','left'],['sky','taupe','right'],['garden','pink','right']]){const item=items[key],a=actors.find(a=>a.id===id),hand=a?.hands?.[side];if(!item||!hand)continue;const size=Math.min(v.w*.15,s.sceneStage==='painting'?a.face.w*.8:key==='garden'&&item.variant==='flower'?65:54);draw(p,key,item.variant,hand.x,hand.y+size*.12,size,painting);}}
 VF.RelicJourney=RelicJourney;VF.RelicVisual={draw,carry};
})();
