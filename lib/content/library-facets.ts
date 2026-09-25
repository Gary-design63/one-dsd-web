import { DOMAINS,ROLE_FAMILY_LABEL,type RoleFamily,type Domain } from '@/lib/domains';
import type { ContentItem } from './types';
export type LibraryFacets = {role?:string;topic?:string};
export function matchesLibraryFacets(item:ContentItem, filters:LibraryFacets, domains: readonly Pick<Domain,'tasks'>[]=DOMAINS):boolean {
  if(filters.role && (!Object.hasOwn(ROLE_FAMILY_LABEL,filters.role) || !domains.some(domain=>domain.tasks.some(task=>task.roles.includes(filters.role as RoleFamily)&&task.contentIds.includes(item.id)))))return false;
  if(filters.topic && !item.tags.includes(filters.topic))return false;
  return true;
}
