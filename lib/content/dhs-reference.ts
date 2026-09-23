import reference from "@/data/organization/minnesota-dhs.json";
export const DHS_REFERENCE_PATH = "/understanding-dhs";
export const dhsTopicAnchor = (id: string) => id.replace(/^ext-dhs-org-/, "");
export const DHS_REFERENCE_GROUPS = [
  {id:"organization",title:"DHS and its partners",topics:["purpose","structure","strategy","dsd-placement","dcyf","dct"]},
  {id:"disability",title:"Disability services and everyday support",topics:["dsd-choice","manuals","assessment","person-centered","cfss","waiver-change","rates","employment","licensing","transitions","navigation","grants"]},
  {id:"services",title:"Health, housing and community life",topics:["mhcp","behavioral-health","housing","aging","adult-protection"]},
  {id:"partnerships",title:"Partnerships and equitable access",topics:["county-tribal","tribal-relations","civil-rights","language-access"]},
  {id:"people-operations",title:"People and operations",topics:["workforce","operations","legislative"]},
].map(group => ({...group,entries:group.topics.map(id => reference.entries.find(entry=>dhsTopicAnchor(entry.id)===id)!)}));
