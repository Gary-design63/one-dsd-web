import type { WorkTask } from '@/lib/domains';
import { MEASUREMENT_HREF, MEASUREMENT_RESOURCE_ID } from '@/lib/content/measurement-practice';
/** Add a usable supplement without changing the original domain/task/path records. */
export function taskPracticeHref(domainId:string,task:WorkTask|undefined,surfaces:ReadonlySet<string>,resources:ReadonlySet<string>):string|undefined {
 if(!task)return undefined;
 if(task.pathId && surfaces.has('graduation-path.'+task.pathId))return '/practice/'+task.pathId;
 if(domainId==='measurement' && task.id==='evaluation-plan' && surfaces.has('practice.measurement') && surfaces.has('practice.page') && resources.has(MEASUREMENT_RESOURCE_ID))return MEASUREMENT_HREF;
 return undefined;
}
