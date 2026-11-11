/* DOM owns the caption surface; Canvas consumes its measured reserve. */
(() => {
 class DialogueLayout{
  constructor(changed){this.panel=document.getElementById('reading-panel');this.text=document.getElementById('caption-text');this.speaker=document.getElementById('caption-speaker');this.probe=document.getElementById('caption-measure');this.changed=changed;this.height=120;this.revision=0;this.key='';this.sceneKey='';this.presentation='';this.measuring=false;
   this.observer=new ResizeObserver(()=>{if(!this.measuring){this.sceneKey='';changed();}});this.observer.observe(this.panel);document.fonts?.addEventListener('loadingdone',()=>{this.sceneKey='';changed();});
  }
  sync(shot,b,line){const key=[shot.id,b.id,line,b.speaker].join('|');if(key!==this.key){this.key=key;this.text.textContent=line;this.speaker.textContent=VF.GuardianNames[b.speaker]||'';this.panel.dataset.turn=b.id;this.revision++;}this.quiet=b.kind==='choice'||!line||['photo','read','question','homecoming'].includes(b.view);this.panel.dataset.quiet=String(this.quiet);}
  measure(w,h){const style=getComputedStyle(this.text),key=[this.shot?.id,w,h,style.fontSize,style.lineHeight].join('|');if(key===this.sceneKey)return this.height;this.sceneKey=key;this.measuring=true;this.panel.style.minHeight='0px';const ps=getComputedStyle(this.panel);Object.assign(this.probe.style,{width:Math.max(180,this.panel.getBoundingClientRect().width||w-(w<=350?32:44))+'px',fontSize:style.fontSize,lineHeight:style.lineHeight,padding:ps.padding});let maximum=0;for(const text of this.lines||['']){this.probe.textContent=text;maximum=Math.max(maximum,this.probe.scrollHeight+24);}this.height=Math.max(112,maximum,this.panel.scrollHeight);this.panel.style.minHeight=this.height+'px';this.measuring=false;return this.height;}
  setScene(shot){if(this.shot?.id===shot.id)return;this.shot=shot;this.lines=(VF.GuardianScript[shot.id]||[]).filter(b=>b.kind!=='choice'&&!b.departure).map(b=>b.text||'');for(const def of Object.values(VF.StoryGraph.choices))if(def.chapter===shot.id)this.lines.push(...def.options.map(o=>o.resultDialogue));for(const def of Object.values(VF.StoryGraph.choices))for(const op of def.options)if(op.futureDialogue?.[shot.id]?.text)this.lines.push(op.futureDialogue[shot.id].text);if(shot.id==='el-bosque-escucha')this.lines.push('La lucecita nos espera. ¿Le abrimos un camino, Lio?');this.sceneKey='';}
  present(status){const next=this.quiet?'quiet':status.visible?'bubble':status.reason==='no-safe-space'?'docked':'subtitle';if(next!==this.presentation){this.presentation=next;this.panel.dataset.presentation=next;}}
  bounds(){const r=this.panel.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};}
 }
 VF.DialogueLayout=DialogueLayout;
})();
