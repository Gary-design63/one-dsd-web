import { gapCourse, type GapSpec } from './build';
import spec from './specs/dsd-housing-instability.json';

export default gapCourse(spec as GapSpec);
