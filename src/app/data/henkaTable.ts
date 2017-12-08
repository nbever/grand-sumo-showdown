import {
  VICTORY,
  LOSE_1_COLUMN,
  LOSE_2_COLUMNS,
  DEFEAT
} from '../constants/resultConstants';

const HENKA_TABLE = [
  { min: 1, max: 8, result: VICTORY },
  { min: 9, max: 13, result: LOSE_1_COLUMN },
  { min: 14, max: 18, result: LOSE_2_COLUMNS },
  { min: 19, result: DEFEAT }
];

export { HENKA_TABLE };
