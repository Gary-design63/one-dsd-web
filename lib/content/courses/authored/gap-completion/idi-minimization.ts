import { gapCourse, type GapSpec } from './build';
import spec from './specs/idi-minimization.json';

export default gapCourse(spec as GapSpec);
