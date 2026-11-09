(() => {
  const APIs={vineyard:'asciiVineyard',rabbit:'asciiBunny',mushroom:'asciiMushroom',museum:'asciiMuseum',couple:'asciiStargazers',lily:'bouquetDebug',memory07:'__portrait07',memory08:'__asciiPortrait',memory09:'ASCIIAtelier'};
  const signals={rabbit:'ascii-bunny-host',mushroom:'ascii-mushroom-host',couple:'ascii-stargazers-host'};
  class Engine {
    constructor(chapter){this.chapter=chapter;this.adapter=window.VSceneAdapters.get(chapter.id);this.abort=new AbortController();this.frame=null;this.api=null;this.cost=0;this.steps=0;this.draws=0;this.ready=false;this.playing=false;this.accumulated=0;this.revision=0;}
    async prepare(width,height){
      if(this.abort.signal.aborted)throw new DOMException('Preparation cancelled','AbortError');
      const frame=document.createElement('iframe');
      this.frame=frame;
      frame.title=`Motor de ${this.chapter.short}`;
      frame.tabIndex=-1;
      frame.setAttribute('referrerpolicy','no-referrer');
      frame.width=String(Math.max(300,Math.round(width)));frame.height=String(Math.max(300,Math.round(height)));
      frame.style.width=frame.width+'px';frame.style.height=frame.height+'px';
      if(this.chapter.id==='lily')frame.id='bouquet-iframe';
      const loaded=new Promise((resolve,reject)=>{
        const timeout=setTimeout(()=>reject(new Error('El motor tardó demasiado en prepararse.')),15000);
        this.cancelLoad=()=>{clearTimeout(timeout);reject(new Error('Preparation cancelled'));};
        frame.onload=()=>{clearTimeout(timeout);this.cancelLoad=null;resolve();};
        frame.onerror=()=>{clearTimeout(timeout);reject(new Error('No se pudo cargar la obra.'));};
      });
      frame.srcdoc=window.VEngines[this.chapter.id];
      document.getElementById('engine-host').append(frame);
      await loaded;
      if(this.abort.signal.aborted||!this.frame)throw new DOMException('Preparation cancelled','AbortError');
      const win=frame.contentWindow;
      this.win=win;this.api=win[this.adapter.api];this.canvas=win.document.querySelector('canvas');
      if(!this.api||!this.canvas||!win.__filmClock)throw new Error(`Contrato incompleto: ${this.chapter.id}`);
      this.capabilities=window.VSceneAdapters.inspect(this.chapter.id,this.api);
      // Embedded images decode asynchronously even with onload. Bound readiness, do not guess.
      const images=[...win.document.images];
      await this.bounded(Promise.all(images.map(img=>window.VImageReady(img,this.abort.signal))));
      await this.bounded(win.document.fonts.ready);
      const deadline=performance.now()+15000;let stable=0,previous='';
      while(stable<2){
        if(!this.frame||!this.canvas)throw new Error('Preparation cancelled');
        if(performance.now()>deadline)throw new Error('La obra no terminó de preparar su primer fotograma.');
        win.__filmClock.tick(0);
        const state=this.api.getState(),size=this.canvas.width+'x'+this.canvas.height;
        stable=state.ready!==false&&state.initialized!==false&&this.canvas.width>1&&this.canvas.height>1&&size===previous?stable+1:0;previous=size;
        await new Promise(requestAnimationFrame);
      }
      if(this.abort.signal.aborted||!this.api||!this.canvas)throw new DOMException('Preparation cancelled','AbortError');
      this.seek(0);this.canvas.getContext('2d').getImageData(0,0,1,1);
      if(!win.__filmDraws)throw new Error('La obra no confirmó un primer dibujo.');
      this.prepared={width:this.canvas.width,height:this.canvas.height,stableFrames:stable,fontsReady:win.document.fonts.status==='loaded',resourcesReady:this.api.getState().ready!==false&&this.api.getState().initialized!==false,firstDraw:true,drawFrames:win.__filmDraws};
      this.pause();this.ready=true;
      return this;
    }
    async bounded(promise){
      let timer,abort;const signal=this.abort.signal;
      try{return await Promise.race([promise,new Promise((_,reject)=>{abort=()=>reject(new DOMException('Preparation cancelled','AbortError'));if(signal.aborted)return abort();signal.addEventListener('abort',abort,{once:true});timer=setTimeout(()=>reject(new Error('La obra no terminó de cargar. Puedes reintentar o continuar.')),15000);})]);}
      finally{clearTimeout(timer);signal.removeEventListener('abort',abort);}
    }
    async resize(width,height){
      const wasPlaying=this.playing,state=this.state(),time=Number(state.time??state.t)||0;
      this.pause();this.frame.width=String(Math.round(width));this.frame.height=String(Math.round(height));this.frame.style.width=this.frame.width+'px';this.frame.style.height=this.frame.height+'px';
      await new Promise(requestAnimationFrame);if(!this.win)return;this.win.dispatchEvent(new this.win.Event('resize'));
      await new Promise(requestAnimationFrame);if(!this.win)return;this.restore(time);if(wasPlaying)this.play();
      this.prepared={...this.prepared,width:this.canvas.width,height:this.canvas.height};
    }
    command(action){
      const c=this.chapter;
      if(c.id==='lily')this.win.postMessage({type:`bouquet:${action}`},location.origin==='null'?'*':location.origin);
      else this.win.postMessage({source:signals[c.id],action},location.origin==='null'?'*':location.origin);
    }
    pause(){
      this.playing=false;
      if(!this.api)return;
      if(this.api.pause)this.api.pause();
      else if(this.chapter.id==='lily')this.api.setTime(this.api.getState().time);
      this.win.__filmClock.tick(0);
    }
    play(){
      if(!this.api||this.abort.signal.aborted)return;
      this.playing=true;
      if(this.api.play)this.api.play();else this.command('play');
    }
    seek(seconds){
      if(!Number.isFinite(seconds)||!this.api||this.abort.signal.aborted)return;
      const sec=Math.max(0,Math.min(this.chapter.engineDuration,seconds));
      this.api.pause?.();
      if(this.api.seek)this.api.seek(sec);else this.api.setTime(sec);
      this.win.__filmClock.tick(0);
      this.revision++;
      this.playing=false;
    }
    replay(){this.seek(0);this.play();}
    restore(seconds,narrative=null){
      if(!Number.isFinite(seconds)||!this.api)return;
      this.api.pause?.();if(narrative)this.api.restoreNarrative?.(narrative);if(this.api.restore)this.api.restore(Math.max(0,seconds));else if(this.api.seek)this.api.seek(Math.max(0,seconds));else this.api.setTime(Math.max(0,seconds));
      this.win.__filmClock.tick(0);this.revision++;this.playing=false;
    }
    step(dt){
      if(!this.ready||!this.playing)return;
      this.accumulated+=dt;
      if(this.accumulated<1/(this.profile?.engineFPS||24))return;
      const elapsedTime=this.accumulated;this.accumulated=0;
      const begin=performance.now();
      const pending=this.win.__filmClock.pending;
      const performed=this.api.advancePerformance?.(elapsedTime);
      this.win.__filmClock.tick(elapsedTime);
      if(pending||performed)this.revision++;
      const elapsed=performance.now()-begin;
      this.cost=this.cost*.93+elapsed*.07;this.steps++;
    }
    setProfile(profile){this.profile=profile;if(this.win)this.win.__filmRasterLimit=profile.raster;if(!this.api)return;if(this.chapter.id==='lily'){this.api.setDensity(profile.name==='premium'?'fine':profile.name==='balanced'?'normal':'coarse');}else{const state=this.api.getState(),field=this.chapter.id==='vineyard'?'thick':'coarse',desired=profile.name==='battery',control={vineyard:'density',rabbit:'density',mushroom:'texture',museum:'texture',couple:'texture'}[this.chapter.id];if(control&&typeof state[field]==='boolean'&&state[field]!==desired)this.win.document.getElementById(control)?.click();}this.balanced=profile.name==='battery';}
    firstFrameReady(){return this.ready&&!!this.prepared?.firstDraw;}
    narrativeState(){return this.api?.captureNarrative?.()||null;}
    stats(){return{draws:this.win?.__filmDraws||0,steps:this.steps,costMs:this.cost,capabilities:this.capabilities||{}};}
    state(){return{...(this.api?.getState()||{}),drawFrames:this.win?.__filmDraws||0};}
    balance(){
      if(this.balanced)return;this.balanced=true;
      if(this.chapter.id==='lily'){this.api.setDensity('coarse');return;}
      const id={vineyard:'density',rabbit:'density',mushroom:'texture',museum:'texture',couple:'texture',memory08:'density'}[this.chapter.id];
      if(id)this.win.document.getElementById(id)?.click();
    }
    interact(nx=.5,ny=.45){
      const rect=this.canvas.getBoundingClientRect();
      const init={bubbles:true,clientX:rect.left+rect.width*nx,clientY:rect.top+rect.height*ny,pointerType:'touch'};
      this.canvas.dispatchEvent(new this.win.PointerEvent('pointerdown',init));
      this.canvas.dispatchEvent(new this.win.MouseEvent('click',init));
      this.win.__filmClock.tick(0);
      this.revision++;
    }
    dispose(){this.abort.abort();this.playing=false;this.cancelLoad?.();this.cancelLoad=null;this.win?.__filmClock?.clear();this.frame?.remove();this.frame=null;this.api=null;this.win=null;this.canvas=null;this.ready=false;}
  }
  window.VEngine=Engine;
})();
