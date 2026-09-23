const fs=require("fs"),path=require("path");
const {AlignmentType,BorderStyle,Document,HeadingLevel,LevelFormat,Packer,PageNumber,Paragraph,ShadingType,Table,TableCell,TableRow,TextRun,WidthType,Footer,TabStopType,PageBreak}=require("docx");
const FONT="Aptos",NAVY="003865",BLACK="000000",WHITE="FFFFFF";
const tx=(t,o={})=>new TextRun({text:t,font:FONT,size:22,color:BLACK,...o});
const b=(t,o={})=>tx(t,{bold:true,...o});
const p=(c,o={})=>new Paragraph({spacing:{after:160,line:288},...o,children:Array.isArray(c)?c:[tx(c)]});
const h1=(t)=>new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:400,after:180},border:{bottom:{style:BorderStyle.SINGLE,size:6,color:NAVY,space:6}},children:[new TextRun({text:t,font:FONT,size:26,bold:true,color:NAVY})]});
const h2=(t)=>new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:300,after:110},children:[new TextRun({text:t,font:FONT,size:23,bold:true,color:NAVY})]});
const bl=(c)=>new Paragraph({numbering:{reference:"an-b",level:0},spacing:{after:80,line:282},children:Array.isArray(c)?c:[tx(c)]});
const nb=(c)=>new Paragraph({numbering:{reference:"an-n",level:0},spacing:{after:110,line:282},children:Array.isArray(c)?c:[tx(c)]});
const quote=(t,src)=>new Paragraph({spacing:{before:120,after:160,line:282},indent:{left:420},border:{left:{style:BorderStyle.SINGLE,size:12,color:NAVY,space:12}},children:[tx("“"+t+"”",{italics:true}),...(src?[tx("   — "+src,{size:19})]:[])]});
const cell=(t,{header=false,width,bold=false}={})=>new TableCell({width:{size:width,type:WidthType.DXA},shading:header?{type:ShadingType.CLEAR,fill:NAVY,color:"auto"}:undefined,margins:{top:80,bottom:80,left:110,right:110},children:[new Paragraph({spacing:{after:0,line:264},children:[new TextRun({text:t,font:FONT,size:18,bold:header||bold,color:header?WHITE:BLACK})]})]});
const bd=Object.fromEntries(["top","bottom","left","right","insideHorizontal","insideVertical"].map(k=>[k,{style:BorderStyle.SINGLE,size:4,color:NAVY}]));
const table=(w,h,r)=>new Table({width:{size:w.reduce((a,x)=>a+x,0),type:WidthType.DXA},columnWidths:w,borders:bd,rows:[new TableRow({tableHeader:true,children:h.map((x,i)=>cell(x,{header:true,width:w[i]}))}),...r.map(row=>new TableRow({children:row.map((v,i)=>cell(v,{width:w[i],bold:i===0}))}))]});
const line=(l,v)=>new Paragraph({spacing:{after:70},tabStops:[{type:TabStopType.LEFT,position:1500}],children:[new TextRun({text:l,font:FONT,size:21,bold:true,color:NAVY}),new TextRun({text:"\t"+v,font:FONT,size:22,color:BLACK})]});
const rule=(bf=120,af=260)=>new Paragraph({spacing:{before:bf,after:af},border:{bottom:{style:BorderStyle.SINGLE,size:12,color:NAVY,space:2}},children:[]});

const cats=[
 ["Equity carried without operational means","10 of 23","Staff want equity in their daily work and lack the direction, shared definition and usable tools to put it there. The Equity Analysis Toolkit is described as built for policy development and hard to apply elsewhere."],
 ["Community trust, built or spent","12 of 23","A recognized disconnect between the Division and the communities it serves; distrust that must be addressed before engagement works; engagement that is not sustained; difficulty reaching people with lived experience."],
 ["Access and language as everyday work","12 of 23","Translation backlogs, inconsistency between translators, inaccessible public websites, accessibility tools too costly or complex to use widely, and a view that accessibility belongs in everyone's job rather than a specialist's."],
 ["Silos and broken feedback loops","11 of 23","External communications issued without internal consultation; no consistent way to carry community feedback across the Division; no division-wide work plan; reliance on written channels only."],
 ["Policy, bureaucracy and politics as constraint","11 of 23","Barriers described as internal to DHS more often than legislative; approval delays; funding and reimbursement inflexibility; contractors not held to accessibility terms; counties and lead agencies outside direct control."],
 ["Who gets in, who advances, who is paid","10 of 23","A predominantly white workforce serving communities that are not; a predominantly BIPOC home care workforce unmatched by Division staffing; gatekeeping in hiring; wage and classification disparities; opaque HR data."],
 ["Time and workload crowd it out","7 of 23","Competing demands, tight deadlines and a stated tension between efficiency and equity, in which efficiency wins by default unless space is made deliberately."],
 ["Data that cannot be reached","7 of 23","Restricted data sets, no access to human resources statistics, no training in qualitative analysis, research agendas driven reactively by others' needs."],
 ["Fear that the work is performative","5 of 23","Equity assessments conducted after decisions are made, described as a check-the-box exercise; a culture of perfection that discourages risk; a sense that effort since 2017 has been largely performative."],
 ["Psychological safety and belonging","5 of 23","Bias and distrust experienced from other divisions; morale and discouragement; loneliness and relationship needs of people served; a Christian-centric holiday calendar; and, in several teams, genuine psychological safety and strong culture."],
];

const cross=[
 ["Equity carried without operational means","Direction, a shared definition, and tools that work outside policy development","Equity Analysis Toolkit companion and guided walkthrough that records an analysis; Operationalizing equity; practice paths; job aids attached to courses","Built"],
 ["Community trust, built or spent","Understanding of communities before engaging them; sustained rather than episodic contact","Minnesota Communities briefs; community engagement and connections; the community engagement planner","Built"],
 ["Access and language as everyday work","Accessibility as everyone's responsibility, with plain language and usable checks","Access checks; plain language in human services; language access planning; working with an interpreter; accessible-document practice","Built"],
 ["Silos and broken feedback loops","One place to look, and a way for feedback to come back","One DSD Team work-item cycle with a named decision owner and a return; Amplify; ASK; the Program as a single source","Built"],
 ["Policy, bureaucracy and politics as constraint","Equity considered in legislative proposals and contracting, not after","Legislative dimension of the work","Not yet built"],
 ["Who gets in, who advances, who is paid","Fair hiring, visible advancement, honest workforce data","Inclusive hiring practice; leadership development across the employee life cycle; mentoring, sponsorship and accessible pathways","Built"],
 ["Time and workload crowd it out","Resources usable inside the work, not added on top","Short job aids; resources downloadable in Word, Excel, PowerPoint and PDF; ASK for a direct answer with its sources and limits","Built"],
 ["Data that cannot be reached","Baseline data, disaggregated, that teams can actually see","Measurement and evaluation plan; baseline collection; quarterly disaggregated reporting","Not yet built"],
 ["Fear that the work is performative","Analysis before the decision, and proof that participation is not assessment","Equity Pause and analysis before decisions; voluntary participation; evaluation that examines program support and never an individual","Partly built"],
 ["Psychological safety and belonging","Skills for difficult conversation, and a culture that makes room","Intercultural practice curriculum; conflict, repair and accountability; emotional intelligence; employee resource groups; Amplify well-being","Built"],
];

const kids=[
 new Paragraph({spacing:{after:40},children:[new TextRun({text:"WHAT THE DIVISION SAID",font:FONT,size:32,bold:true,color:NAVY})]}),
 new Paragraph({spacing:{after:60},children:[new TextRun({text:"A qualitative analysis of equity needs across the Disability Services Division,",font:FONT,size:21,color:BLACK})]}),
 new Paragraph({spacing:{after:200},children:[new TextRun({text:"and the evidentiary basis for the One DSD People, Access and Culture Program",font:FONT,size:21,color:BLACK})]}),
 rule(0,240),
 line("PREPARED BY","Gary Banks, Equity and Inclusion Operations Consultant"),
 line("IN COLLABORATION WITH","Sarah Shepherd, Project Manager, Disability Services Division"),
 line("PREPARED FOR","Leigh Ann Ahmad, Manager \u2014 Heidi Hamilton, Division Director"),
 line("DIVISION","Disability Services Division, Aging and Disability Services Administration"),
 line("DATE","September 18, 2026"),
 line("STATUS","Draft for review"),
 rule(140,300),

 h1("1. Purpose and standing"),
 p("This document sets out what staff across the Disability Services Division said about equity in their own work, and what a formal qualitative analysis of those statements shows. It exists for one reason: the One DSD People, Access and Culture Program should be able to demonstrate, not assert, that it was built from the Division's own account of itself."),
 p("It is an analysis of what was said. It does not measure any individual, it does not evaluate any team's performance, and it does not establish policy. Where it recommends, it recommends as a consultant to the Division."),

 h1("2. The evidence base"),
 p([tx("Between January and July 2023 the consultant conducted "),b("71 interviews"),tx(" independently with staff and leaders across the Division. From April 2023 the work continued in collaboration with Sarah Shepherd, Project Manager for the Disability Services Division, and ran in that form until December 2023. Together this produced a general equity assessment and a program of division-wide listening sessions; the 71 interviews preceding them were conducted by the consultant alone. The collaboration continued on planning matters until the project manager's departure from the agency at the end of 2024.")]),
 p("The record analyzed here covers 23 distinct sessions, producing 172 findings and 131 recommendations. Participation reached the whole vertical of the Division:"),
 bl([b("Seventeen program teams"),tx(" — including waiver policy compliance, EIDBI, service agreement and screening support, research and evaluation, fiscal policy, program integrity, the Disability Hub and Response System, training and technical consultation, Moving Home Minnesota, assessment and support planning, regional resource specialists, division supports, home care and self-directed services, HCBS compliance coordination, support planning and informed choice, community capacity and positive supports, and interagency leads and strategic communications.")]),
 bl([b("Managers, supervisors and directors"),tx(" in their own sessions, with additional sessions held for managers and supervisors.")]),
 bl([b("A session for those who could not attend"),tx(" their own team's meeting, so that absence did not mean exclusion.")]),
 p("Three one-to-one community engagement meetings held in the same period are set aside from this analysis. They involved named external partners rather than anonymous staff participants, and belong to the community engagement record."),
 p([b("De-identification. "),tx("Findings are attributed to teams, never to individuals. That was the condition under which people spoke and it is preserved here. Sarah Shepherd is named as facilitator and analyst, which is credit for professional work rather than identification of a participant.")]),

 h1("3. Method"),
 p("The analysis follows standard qualitative procedure. Open coding assigned preliminary labels to each of the 172 findings. Axial coding then connected those labels into categories and established the relationships between them, using the coding paradigm of phenomenon, causal conditions, context, intervening conditions, action and interaction strategies, and consequences."),
 p("The purpose of axial coding is to move beyond description. A list of complaints tells you what people said; an axial analysis tells you how the parts relate — what produces the condition, what makes it better or worse, what people do about it, and what follows. That is what a program has to be designed against."),

 h1("4. Open coding: ten categories"),
 p("The 172 findings resolved into ten categories. The prevalence column states how many of the 23 sessions raised the category independently."),
 table([2700,1100,5560],["Category","Sessions","What staff described"],cats),

 new Paragraph({children:[new PageBreak()]}),
 h1("5. Axial analysis"),
 h2("5.1 The central phenomenon"),
 p([b("Equity is carried as individual effort without an operational system.")]),
 p("This is the condition every other finding organizes around, and it is important to state what it is not. It is not an absence of commitment. Commitment appears at every level of the Division, unprompted, including from teams under considerable pressure. What staff described is people doing equity work on their own initiative, in the margins of their workload, without shared tools, shared language, reachable data or protected time — and doubting that it changes anything."),
 quote("The team expressed a willingness to engage in this work but needs guidance and support from leadership on how to do so effectively.","A program team"),
 quote("Team members are individually incorporating equity into their work, particularly by focusing on accessibility and language accessibility.","A program team"),
 p("That is a capability problem, not a motivation problem. It has a remedy, and the remedy is operational."),

 h2("5.2 Causal conditions"),
 p("Four conditions produce the phenomenon."),
 nb([b("A mandate that arrives as expectation without capability. "),tx("The One Minnesota Plan, the DHS Equity Policy, the Olmstead Plan and the Administration's equity implementation plan all require equity work. Ten of twenty-three sessions described wanting to meet that requirement in daily work and not knowing how.")]),
 nb([b("Genuine commitment across the Division. "),tx("This is a causal condition rather than a mitigating one: because people want to act, the absence of means produces frustration and moral fatigue rather than indifference.")]),
 nb([b("Work organized for throughput. "),tx("Managers named the tension directly — a focus on efficiency overshadows the opportunity to apply an equity lens. Without deliberate space, efficiency wins by default.")]),
 nb([b("Tools built for another purpose. "),tx("The Equity Analysis Toolkit is described as geared toward policy development and difficult to apply to communications and other work, so teams outside policy have a requirement without an instrument.")]),

 h2("5.3 Context"),
 p("The conditions operate in a specific setting, and the setting explains why generic approaches do not transfer."),
 bl("A division administering complex, federally regulated programs — waivers, personal care assistance, home and community-based services, early intensive developmental and behavioral intervention — where requirements and funding rules constrain what can change locally."),
 bl("Delivery distributed across lead agencies, counties and contracted providers, so that the Division guides work it does not directly control."),
 bl("A predominantly white workforce serving communities that are substantially not, and a direct support and home care workforce that is predominantly BIPOC without matching representation inside the Division."),
 bl("A legislative and political environment that shapes what can be proposed and when."),
 bl("A history of attempts: staff date efforts to integrate equity to 2017, which is why credibility, not novelty, is the scarce resource."),

 h2("5.4 Intervening conditions"),
 p("These determine whether the same commitment produces change or exhaustion."),
 table([3000,6360],["Condition","How it operates"],[
  ["Protected time","The single most frequently named constraint. Where no space is made, equity work is displaced by deadlines rather than rejected."],
  ["Empowerment, not direction","Supervisors described a top-down approach in which even senior leaders may not feel able to push back. Direction without authority produces compliance, not practice."],
  ["Psychological safety","Present in several teams and named as a supervisor's priority; absent where a culture of perfection discourages risk and learning from error."],
  ["Working feedback loops","Where community feedback and internal consultation do not travel, teams repeat each other's work and communities are asked the same questions twice."],
  ["Reachable data","Without disaggregated data, teams cannot see disparity, and cannot show whether anything they changed worked."],
  ["Fit of the tools","A tool that does not fit the work is not used, however strong the requirement behind it."],
  ["Prior community trust","Engagement is not starting from zero. Distrust already exists in places and is either repaired or deepened by each contact."],
 ]),

 h2("5.5 Action and interaction strategies"),
 p("What staff are already doing, unprompted, is the clearest statement of what they need supported."),
 bl("Incorporating equity individually, most often through accessibility and language, without a shared standard."),
 bl("Asking for clear expectations and visible modeling from supervisors."),
 bl("Building equity into team meetings deliberately, including bringing the equity consultant into them."),
 bl("Applying the Equity Analysis Toolkit where it fits, and improvising where it does not."),
 bl("Seeking partnership with the Data and Quality Improvement team to obtain analysis they cannot perform alone."),
 bl("Pressing for equity analysis earlier in legislative proposals rather than after."),
 bl("Cross-training and sharing knowledge within teams explicitly in order to reduce bias."),
 bl("Building and expanding community participation, including through the Voice of the Individual Project."),

 h2("5.6 Consequences"),
 p("Two outcomes follow, and both are visible in the record."),
 p([b("Where there is no system: "),tx("equity assessments are conducted after decisions are made and experienced as a check-the-box exercise; the work becomes reactive to immediate crises; results vary by who happens to be on a team, so translation quality and accessibility differ across the same Division; and staff report discouragement, pressure and a sense that effort since 2017 has been largely performative. The cost is credibility, and credibility once spent is expensive to recover.")]),
 p([b("Where conditions are right: "),tx("teams reported genuine psychological safety, a culture of knowledge-sharing and cross-training adopted specifically to minimize bias, and accessibility expertise embedded in everyday practice. This matters more than any single finding in this analysis. The conditions that make equity work possible are not hypothetical for this Division — they already exist inside it, in named teams, under the same constraints as everyone else. The task is not invention. It is extension.")]),

 h1("6. How the categories relate"),
 p("The relationships form a cycle rather than a list. Causal conditions — a real mandate, real commitment, throughput pressure and ill-fitting tools — produce equity carried as individual effort. That effort meets a context of regulated complexity, distributed delivery and a workforce that does not mirror the communities served."),
 p("Intervening conditions then decide the outcome. Where time is protected, authority is real, safety exists, feedback travels, data is reachable and tools fit, individual effort becomes shared practice. Where those are missing, the same effort produces performative assessment and fatigue."),
 p("The consequences feed back. Performative work erodes the credibility that makes the next attempt possible, which strengthens the original condition. Conversely, each visible instance of equity work that changed something — and teams described these — rebuilds the conditions for the next one. This is why an operational system matters more than any single initiative: it is what converts individual effort into the kind of result that makes further effort credible."),

 new Paragraph({children:[new PageBreak()]}),
 h1("7. What the Division asked for, and what the Program provides"),
 p("The Program was designed against this analysis. The table states each category, what staff asked for, what the Program now offers, and its honest status. The Program is built and has not launched: “built” means complete and ready for staff when the Division opens it in January 2027, not in use today."),
 table([2200,2400,3600,1160],["Category","What staff asked for","What the Program provides","Status"],cross),
 h2("Two things this analysis asks for that the Program does not yet answer"),
 p([b("Data and accountability measures. "),tx("Seven sessions described data they cannot reach. The Program offers no baseline, no disaggregated reporting and no way for a team to see disparity in its own area. This is the largest single gap between what the Division asked for and what exists.")]),
 p([b("The legislative dimension. "),tx("Eleven sessions named policy, bureaucratic and legislative constraint, and several asked specifically for equity analysis to enter legislative proposals before positions are set. The Program has no legislative content.")]),
 p("Both are named in the consultant's operational workplan as work to be undertaken, and both are carried through to their planned outcome in the program logic model that accompanies this analysis. They are stated here because an analysis that claimed the Program answered everything would not deserve to be believed."),

 h1("8. Consultant's recommendations"),
 nb([b("Conduct a general division-wide equity assessment once every two years. "),tx("The assessment analyzed here concluded in 2024; on a two-year cycle the next was due in 2026 and the findings this Program rests on are now three years old. Resuming the cycle gives the Division a repeated, comparable read on its own culture and gives the Program its own feedback loop: the second assessment measures whether the tools built from the first changed what staff actually experience.")]),
 nb([b("Keep the biennial assessment distinct from the annual climate survey. "),tx("A survey counts; this instrument listens. Findings such as performative equity, a culture of perfection, loneliness and moral fatigue do not appear on a scale. Both are needed and neither substitutes for the other.")]),
 nb([b("Build the data and accountability capability. "),tx("Establish the baseline, disaggregate it, and give teams sight of their own area. Until this exists the Division cannot show whether any equity effort worked.")]),
 nb([b("Move equity analysis before the decision. "),tx("The most damaging single finding in this record is that assessments are performed after decisions are made. No amount of tooling repairs that; it is a sequencing rule that leadership sets.")]),
 nb([b("Protect time explicitly. "),tx("Every other recommendation depends on it. Equity work is not declined in this Division; it is displaced.")]),
 nb([b("Return these findings to the staff who gave them. "),tx("Staff named broken feedback loops in eleven of twenty-three sessions. Publishing this analysis back to the Division is the least expensive and most credible demonstration that speaking up produced something.")]),
 nb([b("Extend what already works. "),tx("Identify the teams that reported psychological safety, cross-training and embedded accessibility, and use their practice as the Division's model rather than importing one.")]),

 h1("9. Method note and limits"),
 bl("This analysis covers what was said in 23 sessions between 2023 and 2024. It is a record of perception and experience, which is the appropriate evidence for questions of culture, and it is not a measurement of conditions."),
 bl("Findings are attributed to teams. Individual participants are not identified anywhere in this document."),
 bl("Prevalence counts state how many sessions raised a category independently. They indicate breadth, not magnitude, and a category raised in five sessions is not thereby less serious than one raised in twelve."),
 bl("The three one-to-one community engagement meetings from the same period are excluded, as described in section 2."),
 bl("Anything concerning Native American individuals, communities or Tribal Nations defers to the Office of Indian Affairs and the Department offices that handle Tribal relations and consultation. Findings in this record that touch Tribal relationships are reported as stated and are not developed further here."),
 bl("The underlying session record requires editorial cleaning before circulation. It contains duplicated passages and named individuals in its present form."),
];

const doc=new Document({creator:"Gary Banks",title:"What the Division Said",
 styles:{default:{document:{run:{font:FONT,size:22,color:BLACK}}}},
 numbering:{config:[
  {reference:"an-b",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:270}}}}]},
  {reference:"an-n",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:300}}}}]},
 ]},
 sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"What the Division Said  ·  Disability Services Division  ·  draft  ·  ",font:FONT,size:17,color:BLACK}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:17,color:BLACK})]})]})},
  children:kids}]});
const out=path.join(__dirname,"What-the-Division-Said-Axial-Analysis.docx");
Packer.toBuffer(doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
