const fs=require("fs"),path=require("path");
const {Packer,Paragraph,PageBreak}=require("docx");
const {tx,b,p,h1,h2,h3,label,bl,nb,quote,table,line,rule,title,docShell}=require("./design.js");
const pb=()=>new Paragraph({children:[new PageBreak()]});

const kids=[
 ...title("THE POSITION, DECOMPOSED",[
   "Equity and Inclusion Operations Consultant, Disability Services Division",
   "The agreed decomposition of the role — the instrument referred to throughout as the donut"]),
 rule(0,240),
 line("CO-CREATED BY","The consultant, who knows the work  —  the operations manager, who wanted the work done  —  the leadership team, which agreed to it"),
 line("AGREED","Early 2023"),
 line("STATUS","The operational understanding under which this position has been carried out"),
 rule(140,300),

 h1("Why this document is in the record"),
 p("This is the decomposition of the Equity and Inclusion Operations Consultant position as it was co-created and agreed in early 2023. It is reproduced here without alteration, so that what was agreed can be read directly."),
 p([b("Two features of the document deserve notice before the duties themselves. "),tx("The first is in the verbs. Read the verbs that open the core duties: provide consultation, provide expert knowledge, plan and lead and facilitate, develop recommendations, establish benchmarks, build the capacity of, lead staff and leadership to assess, work with leadership to oversee, collaborate with hiring managers, serve as technical expert, coordinate, support integration, provide expertise, provide just-in-time training. Almost without exception these are duties discharged ")," ",b("with"),tx(" or "),b("to"),tx(" other people. The position is consultative, capacity-building and coordinating by construction. It was written as a position that works with and through others.")]),
 p([b("The second is the heading on the final section: "),tx("“Use judgment and creativity (Secondary and/or shared duties).” The word "),b("shared"),tx(" is in the agreed document itself. The distribution of responsibility described throughout the accompanying memorandum is the structure of the role as agreed.")]),
 p([b("A third point follows from the first two. "),tx("A substantial number of these duties are impossible to discharge alone, because the document itself names the counterpart: hiring managers, subject matter experts, contract managers, the DSD data team, Fiscal Analysis and Results Management, divisional partners, division leadership. Those duties can be performed as written when that collaboration is in place.")]),

 pb(),
 h1("Core responsibilities (primary duties)"),

 h2("Consultation, collaboration and leadership"),
 bl("Provide consultation, collaboration, and leadership on the design, development, and management of diversity, equity, inclusion, and accessibility (DEIA) principles and activities throughout the division, in alignment with DSD’s strategic plan and DHS anti-racism initiative."),

 h2("Expert knowledge and feedback to division leadership and staff"),
 p("Provide expert knowledge and feedback to division leadership and staff on all matters concerning diversity, equity, and inclusion."),
 bl("This includes guiding policy development, implementation, and compliance. Work to ensure that equity and inclusion are prioritized at the highest levels of the division."),
 bl("Plan, lead, and facilitate internal work groups to address system and organizational culture changes around equity."),
 bl("Develop, document, and present recommendations for creating and sustaining system and organizational culture change around equity as continuous improvement."),
 bl("Establish benchmarks and targets to measure the division’s progress on DEIA."),
 bl("Build the capacity of DSD staff and managers to collaborate with partners and promote equity work."),
 bl("Lead division staff and leadership to assess equity and inclusion awareness and capacity, identify activities to build equity and inclusion including professional development and training opportunities within the division, and implement those activities."),
 bl("Work with leadership to oversee compliance with the DHS Equity Policy, ensuring equity and inclusion are considered in all DSD policies and processes to reduce disparate outcomes for marginalized communities."),
 bl("Promote workforce diversity by collaborating with hiring managers to ensure that the recruitment process is inclusive and attracts a diverse pool of candidates."),

 h2("Compliance specialist and technical expert"),
 p("Serve as a compliance specialist and technical expert to provide just-in-time training and consultation to division staff. Plan, create, direct, and revise the development and implementation plan as it applies to DEIA, including strategies and processes to ensure achievement of plan objectives through a consistent and integrated approach."),
 bl("Coordinate external expertise and training as needed to meet division equity goals."),
 bl("Support integration of culturally and linguistically appropriate services (CLAS) standards into our grants and waiver and state plan services."),

 h2("Leading divisional partners and subject matter experts"),
 p("Lead divisional partners and subject matter experts in the development and implementation of DEIA operational work throughout the division. This involves embedding DEIA principles into all aspects of the division’s operations, including policies, procedures, programs, and services."),
 bl("Provide expertise and logistical support for culturally responsive service development."),
 bl("Provide consultation to subject matter experts to update policies, standard operating procedures, and manuals with a culturally responsive lens."),
 bl("Provide just-in-time training to DSD employees on equity tools, including consultation to support DSD’s internal capacity for equity analyses in legislative proposals."),
 bl("Support building pipelines of diverse talent as part of succession planning within DSD."),
 bl("Promote a consistent onboarding process for the division."),

 h2("Operationalizing equity; evaluating and improving systems and structures"),
 p("Operationalize equity, evaluate and improve systems and structures that support equity in division operations."),
 bl("Lead the development and maintenance of internal accountability mechanisms for the division’s progress on equity-related goals. Collaborate with the DSD data team and Fiscal Analysis and Results Management (FARM) division to measure, track, and analyze the effectiveness of equity initiatives."),
 bl("Provide consultation with policy subject matter experts and contract managers to build diversity and inclusion into each phase of the contract cycle."),
 bl("Collaborate on determining common data elements across the division to measure and monitor progress on equity goals in requests for proposals (RFPs), scoring tools, and quarterly progress reports in the system."),

 pb(),
 h1("Use judgment and creativity (secondary and/or shared duties)"),
 quote("The heading is reproduced as agreed. These duties are designated shared in the document itself."),
 bl("Stay up to date on equity and inclusion trends and best practices related to equity and inclusion and use this knowledge to inform the division’s policies and practices. This includes attending conferences and training sessions, reading relevant literature, and keeping up to date with changes related to equity and inclusion."),
 bl("Monitor and report such as workforce demographics and retention rates. This data should be used to identify areas for improvement and inform equity and inclusion goals."),
 bl("Foster a culture of equity and inclusion within the division by promoting open communication, respect, and inclusion of diverse perspectives. This includes developing and delivering training programs to promote equity, inclusion, and cultural competency, as well as working with employee resource groups to support underrepresented groups within the division."),
 bl("Represent the division in equity and inclusion initiatives, such as conferences, training sessions, and partnerships with other organizations. This includes sharing best practices and collaborating with other organizations to advance equity and inclusion initiatives."),
 bl("Conduct equity and inclusion assessments to evaluate the division’s progress on equity and inclusion, including identifying areas for improvement and developing action plans to address any gaps."),
 bl("Promote employee engagement and feedback by providing opportunities for employees to share their perspectives and experiences related to DEIA issues. This feedback helps identify improvement areas and informs the development of DEIA initiatives."),
 bl("Work with leadership to create a culture of accountability by establishing clear expectations for DEIA work and regularly monitoring progress. This includes holding leaders and employees accountable for their contributions to DEIA initiatives, as well as providing recognition and rewards for those who excel in promoting equity and inclusion."),

 pb(),
 h1("What the agreed decomposition requires of others"),
 p("The following duties name their counterpart in the text of the document. Each depends on that counterpart, and listing them sets out what the agreement contemplated."),
 table([3100,3000,3260],["Duty as written","The counterpart the document names","What is required for it to be performed"],[
  ["Establish benchmarks and targets; lead internal accountability mechanisms","The DSD data team; Fiscal Analysis and Results Management (FARM)","Access to workforce and program data, and analytic capacity the consultant does not hold"],
  ["Build diversity and inclusion into each phase of the contract cycle","Policy subject matter experts; contract managers","Inclusion in the contracting and procurement cycle at the point decisions are made"],
  ["Determine common data elements across the division","The division, collectively","An agreed set of measures and their presence in RFPs, scoring tools and quarterly reports"],
  ["Promote workforce diversity; build pipelines; consistent onboarding","Hiring managers; Human Resources","Participation in recruitment design, succession planning and onboarding"],
  ["Plan, lead and facilitate internal work groups","Division staff and leadership","Staff time released to participate, and standing awareness of what work groups exist"],
  ["Provide consultation to subject matter experts on policies, SOPs and manuals","Subject matter experts across the division","Notice that a policy, procedure or manual is being written or revised"],
  ["Support equity analyses in legislative proposals","DSD legislative staff","Visibility of legislative proposals while they are still being drafted"],
  ["Guide policy development, implementation and compliance","Division leadership","Presence where policy decisions are made, or current information about them"],
 ]),
 p("This is the substance of the request set out in the accompanying memorandum. It is not an expansion of the role. It is what the agreed decomposition already assumed would be in place."),
];

module.exports.doc=docShell({docTitle:"The Position, Decomposed",footer:"The position, decomposed  ·  Equity and Inclusion Operations Consultant  ·  agreed early 2023",children:kids});
if(require.main===module){
 const out=path.join(__dirname,"The-Position-Decomposed-Role-Agreement.docx");
 Packer.toBuffer(module.exports.doc).then(x=>{fs.writeFileSync(out,x);console.log("wrote",out,x.length,"bytes");});
}
