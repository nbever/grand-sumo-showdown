import KIMARITE from '../model/kimarite';

const SPECIAL_ATTACK = 'Special Attack';

const FC_KIMARITE = [
  { min: 1, max: 17, result: KIMARITE.YORIKIRI },
  { min: 18, max: 19, result: KIMARITE.YORITAOSHI },
  { min: 20, result: SPECIAL_ATTACK }
];

const PT_KIMARITE = [
  { min: 1, max: 11, result: KIMARITE.OSHIDASHI },
  { min: 12, max: 16, result: KIMARITE.HATAKIKOMI },
  { min: 17, max: 17, result: KIMARITE.TSUKIDASHI },
  { min: 18, max: 18, result: KIMARITE.OKURIDASHI },
  { min: 19, max: 19, result: KIMARITE.OSHITAOSHI },
  { min: 20, result: SPECIAL_ATTACK }
];

const TT_KIMARITE = [
  { min: 1, max: 6, result: KIMARITE.TSUKIOTOSHI },
  { min: 7, max: 9, result: KIMARITE.HIKIOTOSHI },
  { min: 10, max: 12, result: KIMARITE.UWATENAGE },
  { min: 13, max: 14, result: KIMARITE.SUKUINAGE },
  { min: 15, max: 16, result: KIMARITE.SHITATENAGE },
  { min: 17, max: 17, result: KIMARITE.UWATEDASHINAGE },
  { min: 18, max: 18, result: KIMARITE.KOTENAGE },
  { min: 19, max: 19, result: KIMARITE.KATASUKASHI },
  { min: 20, result: SPECIAL_ATTACK },
];

const SPECIAL_KIMARITE = [
  { min: 1, max: 1, result: KIMARITE.KIMEDASHI },
  { min: 2, max: 2, result: KIMARITE.SHITATEDASHINAGE },
  { min: 3, max: 3, result: KIMARITE.TOTTARI },
  { min: 4, max: 4, result: KIMARITE.TSUKITAOSHI },
  { min: 5, max: 5, result: KIMARITE.KUBINAGE },
  { min: 6, max: 6, result: KIMARITE.WATASHIKOMI },
  { min: 7, max: 7, result: KIMARITE.HIKKAKE },
  { min: 8, max: 8, result: KIMARITE.OKURITAOSHI },
  { min: 9, max: 9, result: KIMARITE.SOTOGAKE },
  { min: 10, max: 10, result: KIMARITE.TSURIDASHI },
  { min: 11, max: 11, result: KIMARITE.SUSOHARAI },
  { min: 12, max: 12, result: KIMARITE.KIRIKAESHI },
  { min: 13, max: 13, result: KIMARITE.SHITATEHINERI },
  { min: 14, max: 14, result: KIMARITE.ABISETAOSHI },
  { min: 15, max: 15, result: KIMARITE.ASHITORI },
  { min: 16, max: 16, result: KIMARITE.UTCHARI },
  { min: 17, max: 17, result: KIMARITE.UWATEHINERI },
  { min: 18, max: 18, result: KIMARITE.HANSOKU },
  { min: 19, max: 19, result: KIMARITE.ISAMIASHI },
  { min: 20, result: KIMARITE.KIMETAOSHI }
];

export {
  FC_KIMARITE,
  PT_KIMARITE,
  TT_KIMARITE,
  SPECIAL_KIMARITE,
  SPECIAL_ATTACK
};
