import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('..',import.meta.url));
const suites=[['scripts/build.mjs'],['--test','tests/contracts.test.mjs','tests/runtime.test.mjs','tests/semantics.test.mjs'],...['core','navigation','worlds','lifecycle','integration','resilience'].map(n=>['tests/rc07-'+n+'.cjs'])];
for(const args of suites){const r=spawnSync(process.execPath,args,{cwd,stdio:'inherit',windowsHide:true,env:{...process.env,VALERIE_FAST_MATRIX:''}});if(r.status!==0)process.exit(r.status||1);}
console.log('RC07 technical verification complete. No screenshots, recordings or videos generated.');
