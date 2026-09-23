const fs=require("fs"),path=require("path");
const {Packer,Paragraph,PageBreak}=require("docx");
const D=require("./design.js");
const {tx,b,p,h1,h2,label,bl,nb,table,line,rule,title,docShell}=D;
const S=JSON.parse(fs.readFileSync(path.join(__dirname,"sessions-clean.json"),"utf8"));
const totalF=S.reduce((a,s)=>a+s.findings.length,0), totalR=S.reduce((a,s)=>a+s.recommendations.length,0);
const GROUPS=[
 ["Program teams",S.filter(s=>!/Managers|Supervisors|Directors|Absentees/i.test(s.team))],
 ["Managers, supervisors and directors",S.filter(s=>/Managers|Supervisors|Directors/i.test(s.team))],
 ["Staff unable to attend their team session",S.filter(s=>/Absentees/i.test(s.team))],
];
const kids=[
 ...title("EVIDENCE RECORD",["Division-wide equity assessment and listening sessions, 2023–2024","Disability Services Division, Aging and Disability Services Administration"]),
 rule(0,240),
 line("PREPARED BY","Gary Banks, Equity and Inclusion Operations Consultant"),
 line("IN COLLABORATION WITH","Sarah Shepherd, Project Manager, Disability Services Division"),
 line("PREPARED FOR","Leigh Ann Ahmad, Manager \u2014 Heidi Hamilton, Division Director"),
 line("SESSIONS RECORDED",`${S.length} · ${totalF} findings · ${totalR} recommendations`),
 line("DATE OF THIS RECORD","September 18, 2026"),
 line("STATUS","Draft for review"),
 rule(140,300),
 h1("What this record is"),
 p("This is the record of what staff said. Between January and July 2023 the consultant conducted 71 interviews independently across the Disability Services Division. From April 2023 the work continued in collaboration with Sarah Shepherd, Project Manager for the Division, and ran in that form until December 2023, producing a general equity assessment and a program of division-wide listening sessions. The interviews themselves were conducted by the consultant alone. That collaboration continued on planning matters until the project manager's departure from the agency at the end of 2024."),
 p(`This document sets out the findings and recommendations from ${S.length} of those sessions: ${totalF} findings and ${totalR} recommendations, as given by the teams themselves. It is the evidentiary basis for the qualitative analysis "What the Division Said" and, through it, for the One DSD People, Access and Culture Program.`),
 h2("How to read it"),
 bl([b("Findings"),tx(" are what a team described about its own conditions, practice and experience.")]),
 bl([b("Recommendations"),tx(" are what that same team proposed. They are the Division's own proposals, not the consultant's.")]),
 bl("Sessions are grouped by program teams, then by managers, supervisors and directors, then by the session held for staff who could not attend their own team's meeting."),
 h2("De-identification"),
 p("Findings and recommendations are attributed to teams, never to individuals. Where the original notes named a person, the text here reads “a participant.” That was the condition under which people spoke and it is preserved. Sarah Shepherd is named as facilitator and analyst, which is credit for professional work rather than identification of a participant."),
 h2("Scope and limits"),
 bl("This record covers what was said in these sessions. It is a record of perception and experience, which is the appropriate evidence for questions of culture, and it is not a measurement of conditions."),
 bl("Three one-to-one community engagement meetings held in the same period are excluded. They involved named external partners rather than anonymous staff participants and belong to the community engagement record."),
 bl("Editorial cleaning has been applied: duplicated passages and working notes from the original drafting have been removed. No finding or recommendation has been added, softened or reordered in substance."),
 bl("Anything concerning Native American individuals, communities or Tribal Nations defers to the Office of Indian Affairs and the Department offices that handle Tribal relations and consultation. Findings that touch Tribal relationships are reported as stated and are not developed further."),
 new Paragraph({children:[new PageBreak()]}),
];
for(const [gname,list] of GROUPS){
 if(!list.length) continue;
 kids.push(h1(gname));
 kids.push(p(`${list.length} ${list.length===1?"session":"sessions"} · ${list.reduce((a,s)=>a+s.findings.length,0)} findings · ${list.reduce((a,s)=>a+s.recommendations.length,0)} recommendations`));
 for(const s of list){
  kids.push(h2(s.team));
  if(s.findings.length){ kids.push(label("Key findings"));
   for(const [t,d] of s.findings) kids.push(bl([b(t+". "),tx(d)])); }
  if(s.recommendations.length){ kids.push(label("The team's recommendations"));
   for(const [t,d] of s.recommendations) kids.push(bl([b(t+". "),tx(d)],"d-b2")); }
 }
}
kids.push(h1("Closing note"));
kids.push(p("Staff in eleven of these sessions described feedback loops that do not close — information given, with nothing returned. Publishing this record back to the Division, alongside the analysis built from it, is the least expensive and most credible answer to that finding."));
const doc=docShell({docTitle:"Evidence record: division-wide equity assessment and listening sessions",footer:"Evidence record  ·  Disability Services Division  ·  draft",children:kids});
const out=path.join(__dirname,"Evidence-Record-DSD-Equity-Sessions.docx");
Packer.toBuffer(doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
