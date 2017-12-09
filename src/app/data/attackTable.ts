import { WIN, LOSE, MATTA } from '../constants/resultConstants';

const ATTACK_TABLE = {
  a: {
    a: [{ min: 1, max: 11, result: WIN }, { min: 12, result: LOSE }],
    b: [{ min: 1, max: 13, result: WIN }, { min: 14, result: LOSE }],
    c: [{ min: 1, max: 15, result: WIN }, { min: 16, result: LOSE }],
    d: [{ min: 1, max: 17, result: WIN }, { min: 18, result: LOSE }],
    e: [{ min: 1, max: 19, result: WIN }, { min: 20, result: LOSE }],
    f: [{ min: 1, max: 19, result: WIN }, { min: 20, result: MATTA }]
  },
  b: {
    a: [{ min: 1, max: 9, result: WIN }, { min: 10, result: LOSE }],
    b: [{ min: 1, max: 11, result: WIN }, { min: 12, result: LOSE }],
    c: [{ min: 1, max: 13, result: WIN }, { min: 14, result: LOSE }],
    d: [{ min: 1, max: 15, result: WIN }, { min: 16, result: LOSE }],
    e: [{ min: 1, max: 17, result: WIN }, { min: 18, result: LOSE }],
    f: [{ min: 1, max: 19, result: WIN }, { min: 20, result: LOSE }]
  },
  c: {
    a: [{ min: 1, max: 7, result: WIN }, { min: 8, result: LOSE }],
    b: [{ min: 1, max: 9, result: WIN }, { min: 10, result: LOSE }],
    c: [{ min: 1, max: 11, result: WIN }, { min: 12, result: LOSE }],
    d: [{ min: 1, max: 13, result: WIN }, { min: 14, result: LOSE }],
    e: [{ min: 1, max: 15, result: WIN }, { min: 16, result: LOSE }],
    f: [{ min: 1, max: 17, result: WIN }, { min: 18, result: LOSE }]
  },
  d: {
    a: [{ min: 1, max: 5, result: WIN }, { min: 6, result: LOSE }],
    b: [{ min: 1, max: 7, result: WIN }, { min: 8, result: LOSE }],
    c: [{ min: 1, max: 9, result: WIN }, { min: 10, result: LOSE }],
    d: [{ min: 1, max: 11, result: WIN }, { min: 12, result: LOSE }],
    e: [{ min: 1, max: 13, result: WIN }, { min: 14, result: LOSE }],
    f: [{ min: 1, max: 15, result: WIN }, { min: 16, result: LOSE }]
  },
  e: {
    a: [{ min: 1, max: 3, result: WIN }, { min: 4, result: LOSE }],
    b: [{ min: 1, max: 5, result: WIN }, { min: 6, result: LOSE }],
    c: [{ min: 1, max: 7, result: WIN }, { min: 8, result: LOSE }],
    d: [{ min: 1, max: 9, result: WIN }, { min: 10, result: LOSE }],
    e: [{ min: 1, max: 11, result: WIN }, { min: 12, result: LOSE }],
    f: [{ min: 1, max: 13, result: WIN }, { min: 14, result: LOSE }]
  },
  f: {
    a: [{ min: 1, max: 1, result: WIN }, { min: 2, result: LOSE }],
    b: [{ min: 1, max: 3, result: WIN }, { min: 4, result: LOSE }],
    c: [{ min: 1, max: 5, result: WIN }, { min: 6, result: LOSE }],
    d: [{ min: 1, max: 7, result: WIN }, { min: 8, result: LOSE }],
    e: [{ min: 1, max: 9, result: WIN }, { min: 10, result: LOSE }],
    f: [{ min: 1, max: 11, result: WIN }, { min: 12, result: LOSE }]
  }
};

export { ATTACK_TABLE };
