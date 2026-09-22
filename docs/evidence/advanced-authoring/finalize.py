from pathlib import Path
import json,re
p=Path(__file__).resolve().parents[3]/"lib/content/courses/authored/diversity-advanced"
extras={
1:('Dovidio and Gaertner, full article','https://cpi.stanford.edu/_media/pdf/Reference%20Media/Dovidio_Gaertner_2000_Discrimination.pdf','University-hosted full primary article for optional examination of the study design and limits.'),
2:('Harris, Whiteness as Property — teaching excerpt','https://kristelia.com/wp-content/uploads/2021/12/Harris-Whiteness-as-Property.pdf','Selected passages from the original legal article, hosted as a teaching reading. This is an edited excerpt, not the complete article or current legal guidance.'),
4:('Fricker, Epistemic Injustice — author-posted introduction','https://www.mirandafricker.com/uploads/1/3/6/2/136236203/introduction.pdf','Open introduction posted by the author. It introduces the book’s concepts; the publisher link is a book record, not an assurance of free access to the complete book.'),
5:('Pascoe and Smart Richman, open full review','https://pmc.ncbi.nlm.nih.gov/articles/PMC2747726/','Open research synthesis for optional reading about methods and limits. Associations do not diagnose an individual or establish the cause of a person’s symptoms.'),
10:('Haslam (2024), Dehumanization and mental health','https://pmc.ncbi.nlm.nih.gov/articles/PMC11083880/','Open author editorial on everyday dehumanization and agency. Its clinical discussion is contextual reading, not a clinical protocol or evidence that these workplace exercises improve health.')}
for n,f in enumerate(sorted(p.glob('div-*.ts')),1):
 s=f.read_text(encoding='utf-8');d=json.loads(s.split('const pack: CoursePack = ',1)[1].split(';\n\nexport default',1)[0])
 if n in extras:
  t,u,note=extras[n]
  if not any(z['href']==u for z in d['sources']):d['sources'].append({'title':t,'href':u,'note':note})
 for source in d['sources']:
  if 'pubmed.ncbi.nlm.nih.gov' in source['href'] and not source['note'].startswith('Abstract and citation record.'):
   source['note']='Abstract and citation record. '+source['note']
  if ('journals.sagepub.com' in source['href'] or 'onlinelibrary.wiley.com' in source['href']) and not source['note'].startswith('Publisher record;'):
   source['note']='Publisher record; full-text access may depend on the publisher or your library. '+source['note']
 for lesson in d['course']['lessons']:
  for block in lesson['blocks']:
   if block['type']=='text':block['body']=block['body'].replace('in their 2000 study','in their selection study')
 d=json.loads(json.dumps(d,ensure_ascii=False).replace('programme','program'))
 f.write_text('import type { CoursePack } from "../../source-types";\n\nconst pack: CoursePack = '+json.dumps(d,ensure_ascii=False,indent=2)+';\n\nexport default pack;\n',encoding='utf-8')
 print(d['course']['id'],len(d['sources']))

