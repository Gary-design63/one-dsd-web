import { gapCourse, type GapSpec } from './build';
import spec from './specs/gc-employee-resource-groups.json';

export default gapCourse(spec as GapSpec);
