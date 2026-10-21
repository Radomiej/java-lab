from pathlib import Path
import argparse,json,subprocess,re
from PIL import Image,ImageOps,ImageDraw
from pypdf import PdfReader
root=Path(__file__).resolve().parents[1]
args=argparse.ArgumentParser();args.add_argument('--pdftoppm',required=True);options=args.parse_args()
manifest=json.loads((root/'docs/java-course-manifest.json').read_text(encoding='utf-8'))
qa=root/'artifacts/java-course-pdf';qa.mkdir(parents=True,exist_ok=True)
thumbs=[];checks=[]
for item in manifest:
 name=Path(item['file']).stem;pdf=root/'public/courses'/item['file'];reader=PdfReader(pdf)
 assert len(reader.pages)==item['pages']
 text='\n'.join(page.extract_text() for page in reader.pages)
 assert not re.search(r'(?m)^\s*(?:const|let)\s+\w+|extends GameLab\.',text),item['file']
 (qa/(name+'.txt')).write_text(text,encoding='utf-8')
 target=root/'public/courses/previews'/name;target.mkdir(parents=True,exist_ok=True)
 subprocess.run([options.pdftoppm,'-scale-to','1400','-png',str(pdf),str(qa/name)],check=True,stdout=subprocess.DEVNULL)
 pages=sorted(qa.glob(name+'-[0-9]*.png'),key=lambda p:int(p.stem.rsplit('-',1)[1]))
 assert len(pages)==item['pages']
 for index,p in enumerate(pages,1):
  image=Image.open(p).convert('RGB');image.save(target/f'page-{index}.webp',quality=90,method=6)
  thumb=ImageOps.contain(image,(285,405));card=Image.new('RGB',(305,435),'#dce6ed');card.paste(thumb,((305-thumb.width)//2,8));ImageDraw.Draw(card).text((10,417),name.replace('kurs-gamedev-java','Java')+' '+str(index),fill='#102b46');thumbs.append(card)
 checks.append({'file':item['file'],'pages':len(pages),'allPreviewsGenerated':True,'javascriptCodeDetected':False})
sheet=Image.new('RGB',(305*4,435*5),'white')
for i,thumb in enumerate(thumbs):sheet.paste(thumb,((i%4)*305,(i//4)*435))
sheet.save(qa/'contact-sheet.jpg',quality=90)
(root/'docs/java-course-pdf-check.json').write_text(json.dumps(checks,indent=2),encoding='utf-8')
print(json.dumps(checks))
