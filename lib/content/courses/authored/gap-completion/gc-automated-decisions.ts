import { gapCourse, type GapSpec } from './build';
import spec from './specs/gc-automated-decisions.json';

export default gapCourse(spec as GapSpec);
