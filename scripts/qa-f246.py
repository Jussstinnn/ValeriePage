import subprocess,os,json,pathlib,concurrent.futures,time
root=pathlib.Path.cwd(); env=os.environ.copy();env['VALERIE_PLAYWRIGHT']=str(root.parent/'VALERIE_CINEMATIC_REBIRTH/node_modules/@playwright/test');env['VALERIE_URL']='http://127.0.0.1:4197'
cases=[('living-tale-runtime.cjs','opening','chromium',390,844),('living-tale-runtime.cjs','forest','chromium',390,844),('living-tale-runtime.cjs','lifecycle','chromium',390,844),('living-tale-runtime.cjs','personal','webkit',390,844),('stability-runtime.cjs','ceremony','chromium',430,932),('stability-runtime.cjs','dig','webkit',390,844),('stability-runtime.cjs','letter','webkit',390,844),('stability-runtime.cjs','surprise','webkit',390,844)]
def run(item):
 file,case,engine,w,h=item;e=env.copy();e.update(VALERIE_CASE=case,VALERIE_ENGINE=engine,VALERIE_WIDTH=str(w),VALERIE_HEIGHT=str(h));at=time.time();r=subprocess.run(['node','tests/'+file],env=e,capture_output=True,text=True,encoding='utf8',errors='replace',timeout=600);out={'test':file,'group':case,'engine':engine,'width':w,'height':h,'exit':r.returncode,'seconds':round(time.time()-at,2),'stdout':r.stdout,'stderr':r.stderr};print(json.dumps({k:v for k,v in out.items() if k not in ['stdout','stderr']}),flush=True);return out
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for r in pool.map(run,cases):
  results.append(r);(root/'QA_F24_6_RUNTIME.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
raise SystemExit(any(r['exit'] for r in results))
