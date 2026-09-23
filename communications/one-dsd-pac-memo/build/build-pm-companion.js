const fs=require("fs"),path=require("path");
const {Packer,Paragraph,PageBreak,ImageRun,AlignmentType,TextRun}=require("docx");
const {FONT,NAVY,BLACK,tx,b,p,h1,h2,label,bl,nb,quote,table,line,rule,title,docShell}=require("./design.js");

function sizeFor(file,maxW=620){
 const {execSync}=require("child_process");
 // Pillow already confirmed present; read dimensions via a tiny inline python call.
 const out=execSync(`python3 -c "from PIL import Image; im=Image.open('${file}'); print(im.size[0],im.size[1])"`).toString().trim();
 const [w,h]=out.split(" ").map(Number);
 const width=maxW, height=Math.round(maxW*h/w);
 return {width,height};
}
function figure(file,caption){
 const dims=sizeFor(file);
 return [
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:120,after:60},
   children:[new ImageRun({data:fs.readFileSync(file),type:"png",transformation:dims})]}),
  new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:220},
   children:[new TextRun({text:caption,font:FONT,size:18,italics:true,color:"5A5A57"})]}),
 ];
}

const RACI=[
 ["Charter the Executive Council","Heidi Hamilton, Division Director","Heidi Hamilton issues the charter","Drafts the charter language and decision-rights structure","Managers; DEIA Council"],
 ["Seat the Division DEIA Council","Heidi Hamilton, Division Director","Managers nominate; the Executive Council confirms","Coordinates the nomination process and member criteria","All staff"],
 ["Decide IDI administration and budget","Heidi Hamilton and ADSA","Heidi Hamilton and ADSA","Researches options; brings a costed recommendation","Managers; supervisors"],
 ["Field the baseline climate survey","Heidi Hamilton, Division Director","HR and Data and Analytics administer it","Designs the instrument; brokers data access","All staff"],
 ["Whether to open the Program in January 2027","Leigh Ann Ahmad and Heidi Hamilton","Leigh Ann Ahmad and Heidi Hamilton","Prepares the readiness picture they decide from","All staff"],
 ["Agree the scope of the legislative workstream","Leigh Ann Ahmad, Manager","Consultant, with DHS Legislative and Government Relations","Scopes the Program content; does not represent the Division's legislative position","Executive Council"],
];

const kids=[
 ...title("THREE-YEAR PLAN: THE PROJECT-MANAGEMENT VERSION",[
   "The same plan, drawn as a timeline, a workflow, and a map of what depends on what",
   "One DSD People, Access and Culture Program · Disability Services Division"]),
 rule(0,240),
 line("PREPARED BY","Gary Banks, Equity and Inclusion Operations Consultant"),
 line("PREPARED FOR","Leigh Ann Ahmad, Manager  —  Heidi Hamilton, Division Director"),
 line("DATE","September 18, 2026"),
 line("STATUS","Draft for review"),
 rule(140,300),

 h1("Why this document exists"),
 p("The three-year plan and blueprint tells its story in words: what idea it's built on, what each year is for, what gap each workstream closes. This document tells the same story a different way — as a timeline, a workflow, and a map of what depends on what — because a good plan should make sense more than one way. Nothing here is new. Every date, every workstream number, and every dependency below comes straight from the plan and the operational workplan. This document just draws it out."),

 h1("1. The three-year timeline, by workstream"),
 p("Ten workstreams, laid out across the same three years as the written plan. Each bar shows how long that workstream stays in active work. The striped part of Workstream 1's bar marks the point where we shift from building the Program to simply keeping it running."),
 ...figure(path.join(__dirname, "../diagrams/diagram-1-roadmap-swimlane.png"),
   "Figure 1. Three-year plan by workstream, January 2027 – December 2029."),
 p("Two things worth noticing that are easy to miss in the written version: Workstream 1 is the only bar that never ends — it's the base that everything else sits on top of. And the widest bars (4, 8, 9) are the exact three gaps the crosswalk found weakest. That's not an accident: the biggest gaps take the longest time to close."),

 h1("2. How a piece of work actually moves"),
 p("The operational workplan describes, in writing, how a work item gets a decision-owner and a result, spread across several workstreams. This is that same process drawn as one flow, because it's the same flow no matter which workstream the item belongs to."),
 ...figure(path.join(__dirname, "../diagrams/diagram-2-governance-workflow.png"),
   "Figure 2. How a piece of work moves through the Program's leadership process."),
 p("The loop at the bottom answers the single most common thing staff told us: that feedback goes nowhere, raised in eleven of twenty-three sessions. Every piece of work, whatever kind it is, ends up back in the content list, in ASK, or in the next update — not filed away and forgotten."),

 h1("3. What has to happen before what"),
 p("Not every workstream can start on day one. Some really do have to wait on others. This map states that plainly, where the written plan only mentions it in passing."),
 ...figure(path.join(__dirname, "../diagrams/diagram-3-dependency-map.png"),
   "Figure 3. What each workstream needs in place before it can start."),
 p([b("The one line on this map that matters most: "),tx("almost everything in the third and fourth columns is waiting on Workstream 3 — setting up leadership — to happen first. If chartering the leadership group or the staff equity group slips, that's not a small delay in one workstream. It delays most of Year 2 and Year 3. That's the very first risk named in the written plan, and this map shows exactly why.")]),

 h1("4. Who decides what, in the first year"),
 table([2400,1900,1900,2100,1060],["Decision","Accountable for the outcome","Carries it out","Consultant's contribution","Informed"],RACI),

 h1("Where each piece of this work lives"),
 bl([b("Three-year plan and blueprint"),tx(" — the full written version this document illustrates, including the idea behind the plan and the full list of gaps.")]),
 bl([b("Program crosswalk"),tx(" — the goal-by-goal findings behind the widest bars in Figure 1.")]),
 bl([b("Operational workplan"),tx(" — the ten-month detail behind Year 1 of the timeline.")]),
];

module.exports.doc=docShell({docTitle:"Three-Year Roadmap: The Project-Management Companion",footer:"PM companion  ·  Disability Services Division  ·  draft",children:kids});
if(require.main===module){
 const out=path.join(__dirname,"Three-Year-Roadmap-PM-Companion.docx");
 Packer.toBuffer(module.exports.doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
}
