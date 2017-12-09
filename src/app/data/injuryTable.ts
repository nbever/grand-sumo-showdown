import {
  INJURY_RESIGN,
  INJURY_RESIGN_ALL,
  INJURY_RESIGN_AND_NEXT,
  INJURY_RESIGN_AND_3,
  INJURY_RESIGN_AND_2,
  INJURY_RESIGN_ALL_AND_NEXT
} from '../constants/resultConstants';

const INJURY_TABLE = [
  { min: 1, max: 10, result: INJURY_RESIGN },
  { min: 11, max: 13, result: INJURY_RESIGN_AND_NEXT },
  { min: 14, max: 15, result: INJURY_RESIGN_AND_2 },
  { min: 16, max: 17, result: INJURY_RESIGN_AND_3 },
  { min: 18, max: 19, result: INJURY_RESIGN_ALL },
  { min: 20, result: INJURY_RESIGN_ALL_AND_NEXT }
];

export { INJURY_TABLE };
