const {AlignmentType,BorderStyle,Document,HeadingLevel,LevelFormat,PageNumber,Paragraph,ShadingType,Table,TableCell,TableRow,TextRun,WidthType,Footer,TabStopType}=require("docx");
const FONT="Aptos",NAVY="003865",BLACK="000000",WHITE="FFFFFF";
const tx=(t,o={})=>new TextRun({text:t,font:FONT,size:22,color:BLACK,...o});
const b=(t,o={})=>tx(t,{bold:true,...o});
const p=(c,o={})=>new Paragraph({spacing:{after:160,line:288},...o,children:Array.isArray(c)?c:[tx(c)]});
const h1=(t)=>new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:400,after:180},border:{bottom:{style:BorderStyle.SINGLE,size:6,color:NAVY,space:6}},children:[new TextRun({text:t,font:FONT,size:26,bold:true,color:NAVY})]});
const h2=(t)=>new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:300,after:110},children:[new TextRun({text:t,font:FONT,size:23,bold:true,color:NAVY})]});
const h3=(t)=>new Paragraph({heading:HeadingLevel.HEADING_3,spacing:{before:240,after:90},children:[new TextRun({text:t,font:FONT,size:21,bold:true,color:NAVY})]});
const label=(t)=>new Paragraph({spacing:{before:140,after:60},children:[new TextRun({text:t,font:FONT,size:18,bold:true,color:NAVY,allCaps:true})]});
const bl=(c,ref="d-b")=>new Paragraph({numbering:{reference:ref,level:0},spacing:{after:80,line:282},children:Array.isArray(c)?c:[tx(c)]});
const nb=(c)=>new Paragraph({numbering:{reference:"d-n",level:0},spacing:{after:110,line:282},children:Array.isArray(c)?c:[tx(c)]});
const quote=(t,src)=>new Paragraph({spacing:{before:120,after:160,line:282},indent:{left:420},border:{left:{style:BorderStyle.SINGLE,size:12,color:NAVY,space:12}},children:[tx("“"+t+"”",{italics:true}),...(src?[tx("   — "+src,{size:19})]:[])]});
const cell=(t,{header=false,width,bold=false}={})=>new TableCell({width:{size:width,type:WidthType.DXA},shading:header?{type:ShadingType.CLEAR,fill:NAVY,color:"auto"}:undefined,margins:{top:80,bottom:80,left:110,right:110},children:[new Paragraph({spacing:{after:0,line:264},children:[new TextRun({text:t,font:FONT,size:18,bold:header||bold,color:header?WHITE:BLACK})]})]});
const bd=Object.fromEntries(["top","bottom","left","right","insideHorizontal","insideVertical"].map(k=>[k,{style:BorderStyle.SINGLE,size:4,color:NAVY}]));
const table=(w,h,r)=>new Table({width:{size:w.reduce((a,x)=>a+x,0),type:WidthType.DXA},columnWidths:w,borders:bd,rows:[new TableRow({tableHeader:true,children:h.map((x,i)=>cell(x,{header:true,width:w[i]}))}),...r.map(row=>new TableRow({children:row.map((v,i)=>cell(v,{width:w[i],bold:i===0}))}))]});
const line=(l,v)=>new Paragraph({spacing:{after:70},tabStops:[{type:TabStopType.LEFT,position:1900}],children:[new TextRun({text:l,font:FONT,size:21,bold:true,color:NAVY}),new TextRun({text:"\t"+v,font:FONT,size:22,color:BLACK})]});
const rule=(bf=120,af=260)=>new Paragraph({spacing:{before:bf,after:af},border:{bottom:{style:BorderStyle.SINGLE,size:12,color:NAVY,space:2}},children:[]});
const title=(t,subs=[])=>[new Paragraph({spacing:{after:subs.length?60:200},children:[new TextRun({text:t,font:FONT,size:32,bold:true,color:NAVY})]}),
  ...subs.map((s,i)=>new Paragraph({spacing:{after:i===subs.length-1?200:60},children:[new TextRun({text:s,font:FONT,size:21,color:BLACK})]}))];
const docShell=({docTitle,footer,children})=>new Document({creator:"Gary Banks",title:docTitle,
  styles:{default:{document:{run:{font:FONT,size:22,color:BLACK}}}},
  numbering:{config:[
    {reference:"d-b",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:270}}}}]},
    {reference:"d-b2",levels:[{level:0,format:LevelFormat.BULLET,text:"–",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:270}}}}]},
    {reference:"d-n",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:300}}}}]},
  ]},
  sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:footer+"  ·  ",font:FONT,size:17,color:BLACK}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:17,color:BLACK})]})]})},
    children}]});
module.exports={FONT,NAVY,BLACK,WHITE,tx,b,p,h1,h2,h3,label,bl,nb,quote,table,line,rule,title,docShell};
