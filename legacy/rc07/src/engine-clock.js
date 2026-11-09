/* Injected before the original engine. A single outer clock owns every RAF.
   No native animation loop or timer survives a pause or frame disposal. */
(() => {
  let time = 1000, id = 0;
  const callbacks = new Map();
  Object.defineProperty(performance, 'now', {value: () => time});
  window.requestAnimationFrame = callback => {callbacks.set(++id, callback); return id;};
  window.cancelAnimationFrame = key => callbacks.delete(key);
  window.__filmClock = {
    tick(dt) {time += Math.max(0,dt)*1000; const work=[...callbacks.values()]; callbacks.clear(); for(const cb of work) cb(time);},
    clear() {callbacks.clear();},
    get pending() {return callbacks.size;},
    get time() {return time;}
  };
})();
