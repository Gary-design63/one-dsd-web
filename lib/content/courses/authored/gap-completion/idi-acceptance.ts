import { gapCourse, type GapSpec } from './build';
import spec from './specs/idi-acceptance.json';

export default gapCourse(spec as GapSpec);
