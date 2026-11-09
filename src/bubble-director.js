/* Scene-aware speech placement: no occupied-position fallback. */
(() => {
 const hit=(a,b,g=0)=>a&&b&&a.x<b.x+b.w+g&&a.x+a.w>b.x-g&&a.y<b.y+b.h+g&&a.y+a.h>b.y-g;
 class BubbleDirector{
  constructor(){for(const [k,id]of Object.entries({box:'character-bubble',tail:'bubble-tail',label:'bubble-speaker',text:'bubble-text'}))this[k]=document.getElementById(id);this.key='';this.status={visible:false};}
  hide(reason){this.box.hidden=true;this.tail.setAttribute('hidden','');this.status={visible:false,reason,presentation:'subtitle'};}
  update(b,actors,v,{reading='both',photo=null,protectedBox=null,keepouts=[],interacting=false}={}){
   const realActor=actors.find(a=>a.id===b.speaker),actor=realActor||{face:{x:v.w*(b.speaker==='pink'?.25:.75),y:v.h*.65,w:0,h:0}};if(reading==='subtitles'||!b.speaker||!b.text||b.kind==='choice'||['photo','read','question','homecoming','macro'].includes(b.view))return this.hide('protected-reading-or-narrator');
   const key=[b.id,b.text,b.speaker,v.w,v.h].join('|');if(key!==this.key){this.key=key;this.position=null;this.text.textContent=b.text;this.label.textContent=VF.GuardianNames[b.speaker];this.box.dataset.speaker=b.speaker;this.tail.dataset.speaker=b.speaker;this.box.dataset.kind='thought';}
   const props=[photo,protectedBox,...keepouts].filter(q=>q&&q.w>0&&q.h>0),blockers=[...actors.flatMap(a=>[a.ink||a.face,a.ears]),...props],top=Math.max(68,(v.safe?.top||0)+66),bottom=v.h-(v.safe?.bottom||0)-(interacting?78:8),width=Math.min(v.w-28,350),clear=c=>c.y>=top&&c.y+c.h<=bottom&&blockers.every(q=>!hit(c,q,5));this.box.hidden=false;this.box.style.width=width+'px';
   let found=this.position&&clear(this.position)?this.position:null;
   if(!found)for(const font of [22,20,18,17]){this.text.style.fontSize=font+'px';this.box.style.padding=font<=18?'7px 12px 9px':'10px 15px 12px';const h=this.box.getBoundingClientRect().height,w=width,x=VF.math.clamp(actor.face.x+actor.face.w/2-w/2,14,v.w-w-14),after=props.length?Math.max(...props.map(r=>r.y+r.h))+8:top,near=Math.max(top,Math.min(...actors.map(a=>a.ears.y))-h-22),preferred=props.length?[after,top,near,bottom-h]:[top,near,bottom-h],candidates=[];for(const y of [...preferred,...Array.from({length:Math.ceil((bottom-top)/12)},(_,i)=>top+i*12)])for(const xx of [x,14,v.w-w-14])candidates.push({x:xx,y,w,h});
    if(this.position&&this.font===font&&clear(this.position))found=this.position;else found=candidates.find(clear);if(found){this.font=font;break;}
   }
   if(!found){this.hide('no-safe-space');return;}this.position=found;this.box.style.transform=`translate(${found.x}px,${found.y}px)`;
   const anchor={x:actor.face.x+actor.face.w*.5,y:actor.face.y},sx=VF.math.clamp(anchor.x,found.x+16,found.x+found.w-16),sy=anchor.y<found.y?found.y:found.y+found.h,margin=b.speaker==='pink'?10:v.w-10,dots=[.22,.54,.84].map((q,i)=>{let d={x:sx+(anchor.x-sx)*q,y:sy+(anchor.y-sy)*q,r:5-i*1.2};if(props.some(p=>hit({x:d.x-d.r,y:d.y-d.r,w:d.r*2,h:d.r*2},p,3)))d.x=margin;return d;});
   if(realActor)this.tail.removeAttribute('hidden');else this.tail.setAttribute('hidden','');this.tail.setAttribute('viewBox',`0 0 ${v.w} ${v.h}`);const tk=JSON.stringify(dots.map(d=>[Math.round(d.x),Math.round(d.y)]));if(tk!==this.tailKey){this.tailKey=tk;this.tail.innerHTML=dots.map(d=>`<circle cx="${d.x}" cy="${d.y}" r="${d.r}"/>`).join('');}
   this.status={visible:true,presentation:'bubble',speaker:b.speaker,box:found,anchor,dots,font:this.font,collisionFree:true,protected:props,offscreen:!realActor};
  }
 }
 VF.BubbleDirector=BubbleDirector;
})();
