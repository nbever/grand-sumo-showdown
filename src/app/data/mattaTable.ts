import {
  WEST_LOSES_1_REROLL,
  EAST_LOSES_1_REROLL,
  REROLL
} from '../constants/resultConstants';

const MATTA_TABLE = [
  { min: 1, max: 14, result: REROLL },
  { min: 15, max: 17, result: EAST_LOSES_1_REROLL },
  { min: 18, result: WEST_LOSES_1_REROLL }
];

export { MATTA_TABLE };
