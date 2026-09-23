'use client';
import { useState } from 'react';
import { MeasurementEvidenceExample } from '@/components/multimedia/measurement-evidence-example';
import type { EditableSurfaceValues } from '@/lib/content/editable-surface-contract';
import { MEASUREMENT_FIELD_IDS, measurementText, measurementNotesText } from '@/lib/content/measurement-practice';
export function MeasurementWorksheet({copy,source}:{copy:Readonly<EditableSurfaceValues>;source:{title:string;href:string}}){
 const [values,setValues]=useState<Record<string,string>>({});const [notice,setNotice]=useState('');const [manual,setManual]=useState(false);
 const text=measurementNotesText(values,copy,source);
 async function copyNotes(){try{await navigator.clipboard.writeText(text);setNotice(measurementText(copy,'copied'));setManual(false)}catch{setNotice(measurementText(copy,'manual'));setManual(true)}}
 function downloadNotes(){let url:string|undefined;try{url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='equity-evaluation-working-notes.txt';document.body.appendChild(link);link.click();link.remove();setNotice(measurementText(copy,'downloadReady'));}catch{setNotice(measurementText(copy,'manual'));setManual(true)}finally{if(url){const pending=url;setTimeout(()=>URL.revokeObjectURL(pending),1000)}}}
 return <><MeasurementEvidenceExample /><section aria-labelledby="measurement-notes-title" className="space-y-6"><h2 id="measurement-notes-title" className="text-2xl font-bold">{measurementText(copy,'notesTitle')}</h2><p className="notice" id="measurement-note-privacy">{measurementText(copy,'privacy')}</p>
 {MEASUREMENT_FIELD_IDS.map(id=><div key={id} className="space-y-2"><label htmlFor={'measurement-'+id} className="block text-lg font-bold">{measurementText(copy,id+'Label')}</label><p id={'measurement-'+id+'-help'} className="text-muted">{measurementText(copy,id+'Help')}</p><textarea id={'measurement-'+id} aria-describedby={'measurement-'+id+'-help measurement-note-privacy'} rows={4} className="w-full rounded-lg border border-line p-3" value={values[id]??''} onChange={event=>setValues(current=>({...current,[id]:event.target.value}))}/></div>)}
 <div className="flex flex-wrap gap-3"><button type="button" className="btn btn--primary" onClick={copyNotes}>{measurementText(copy,'copyLabel')}</button><button type="button" className="btn btn--light" onClick={downloadNotes}>{measurementText(copy,'downloadLabel')}</button></div><p role="status">{notice}</p>
 {manual?<label className="block">{measurementText(copy,'manualLabel')}<textarea className="mt-2 w-full rounded-lg border border-line p-3" readOnly rows={14} value={text} onFocus={event=>event.target.select()}/></label>:null}</section></>;
}
