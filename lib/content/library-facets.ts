import { DOMAINS,ROLE_FAMILY_LABEL,type RoleFamily,type Domain } from '@/lib/domains';
import type { ContentItem } from './types';
export const FRESHNESS_LABELS = {reviewed_recently:'Reviewed within the past year',review_planned:'Review planned',date_unknown:'Review date not recorded'} as const;
export type LibraryFacets = {role?:string;topic?:string;freshness?:string};
export function matchesLibraryFacets(item:ContentItem, filters:LibraryFacets, domains: readonly Pick<Domain,'tasks'>[]=DOMAINS, now=new Date()):boolean {
  if(filters.role && (!Object.hasOwn(ROLE_FAMILY_LABEL,filters.role) || !domains.some(domain=>domain.tasks.some(task=>task.roles.includes(filters.role as RoleFamily)&&task.contentIds.includes(item.id)))))return false;
  if(filters.topic && !item.tags.includes(filters.topic))return false;
  if(filters.freshness){
    const raw=item.reviewDate, at=/^\d{4}-\d{2}-\d{2}$/.test(raw)?Date.parse(raw+'T00:00:00Z'):NaN;
    const valid=Number.isFinite(at)&&new Date(at).toISOString().slice(0,10)===raw;
    const today=Date.parse(now.toISOString().slice(0,10)+'T00:00:00Z');
    if(filters.freshness==='date_unknown')return !valid;
    if(!valid)return false;
    if(filters.freshness==='review_planned')return at>today;
    if(filters.freshness==='reviewed_recently')return at<=today&&at>=today-365*86400000;
    return false;
  }
  return true;
}
