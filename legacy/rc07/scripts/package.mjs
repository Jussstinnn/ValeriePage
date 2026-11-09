import {spawnSync} from 'node:child_process';
import {mkdir,cp,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const built=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:'inherit',windowsHide:true});if(built.status!==0)throw new Error('Release build failed');
const staging=path.join(root,'release-staging');
// Fixed, verified child of the project. Never remove an external or computed parent.
if(path.dirname(staging)!==root)throw new Error('Invalid staging path');
await rm(staging,{recursive:true,force:true});await mkdir(staging);
const edition='VALERIE_CINEMATIC_REBIRTH_RC07_COMPLETO';
const destination=path.join(staging,edition);await mkdir(destination);
// Product release only. Prior evidence, caches and Git history stay in the workspace.
for(const file of ['src','scripts','tests','engines','memories','assets','dist','VALERIE_OFFLINE.html','ENGINE_MANIFEST.json','ENGINE_ORIGINAL_HASHES.json','package.json','package-lock.json','README.md','CAMBIOS_RC07.md','CHECKPOINT_RC07.md','COMO_EJECUTAR_WINDOWS.md','PRODUCT.md','DESIGN.md','.gitattributes','.gitignore']){
 await cp(path.join(root,file),path.join(destination,file),{recursive:true});
}
const zip=path.join(root,edition+'.zip');
if(process.platform==='win32'){
 const quote=s=>"'"+s.replaceAll("'","''")+"'";
 const result=spawnSync('powershell.exe',['-NoProfile','-Command',`Compress-Archive -LiteralPath ${quote(destination)} -DestinationPath ${quote(zip)} -Force`],{stdio:'inherit',windowsHide:true});
 if(result.status!==0)throw new Error('ZIP packaging failed');
}else{
 const result=spawnSync('zip',['-qr',zip,edition],{cwd:staging,stdio:'inherit'});if(result.status!==0)throw new Error('Install zip or package this folder with your system archiver');
}
await rm(staging,{recursive:true,force:true});console.log(zip);
