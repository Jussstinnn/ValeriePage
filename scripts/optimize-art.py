from pathlib import Path
from PIL import Image
import hashlib,json
root=Path.cwd();target=root/'assets/runtime';target.mkdir(exist_ok=True)
manifest={};before=after=0
for source in sorted((root/'assets/art').glob('*.png')):
 img=Image.open(source);transparent=img.convert('RGBA').getextrema()[3][0]<255;dst=source if transparent else target/(source.stem+'.webp')
 if not transparent:
  options=dict(lossless=True,quality=100,method=6,exact=True)
  if img.info.get('icc_profile'): options['icc_profile']=img.info['icc_profile']
  img.save(dst,'WEBP',**options)
 check=Image.open(dst).convert('RGBA');assert img.convert('RGBA').tobytes()==check.tobytes(),source.name
 a=source.stat().st_size;b=dst.stat().st_size;before+=a;after+=b
 manifest[source.name]={'file':dst.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sha256':hashlib.sha256(dst.read_bytes()).hexdigest(),'mime':'image/png' if transparent else 'image/webp','rgbaExact':True,'width':img.width,'height':img.height}
 print(source.name,a,b)
(target/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'before':before,'after':after,'savingPercent':round((1-after/before)*100,1),'photosReencoded':0}))
