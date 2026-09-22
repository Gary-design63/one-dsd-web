import type { GraduationPath } from '@/lib/content/paths';
import type { ArtifactValues } from '@/lib/intelligence/agents/graduation';
import type { PracticeArtifact } from '@/lib/content/practice-artifact';

export function readPracticeValues(input: unknown, path: GraduationPath): { values: ArtifactValues; needsAttention: boolean } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {values:{},needsAttention:input !== null && input !== undefined};
  const raw = input as Record<string,unknown>, values: ArtifactValues = {};
  let needsAttention = false;
  for (const field of path.artifactFields) {
    const value = raw[field.id];
    if (value === undefined) continue;
    if (typeof value === 'string') values[field.id] = field.type === 'list' ? value.split('\n') : value;
    else if (Array.isArray(value) && value.every(item=>typeof item === 'string')) values[field.id] = field.type === 'list' ? value : value.join('\n');
    else needsAttention = true;
  }
  if (Object.keys(raw).some(key=>!path.artifactFields.some(field=>field.id===key))) needsAttention=true;
  return {values,needsAttention};
}

export function practiceNotesText(path: GraduationPath, values: ArtifactValues, source?: PracticeArtifact): string {
  const sections = [path.artifactTitle, path.title, 'Working notes'];
  for (const field of path.artifactFields) {
    const value = values[field.id];
    if (typeof value === 'string' || (Array.isArray(value) && value.every(item=>typeof item==='string'))) {
      const text = Array.isArray(value) ? value.map(item=>'- '+item).join('\n') : value;
      if (text.trim()) sections.push(field.label+'\n'+text);
    }
  }
  if (source) {
    sections.push('Draft context\nPrepared with ASK on '+source.createdAt.slice(0,10)+'. These working notes may include your later changes.');
    if (source.sources.length) sections.push('Resources\n'+source.sources.map(item=>item.title+' — '+item.href).join('\n'));
  }
  return sections.join('\n\n')+'\n';
}
