import { TitleCasePipe } from '@angular/common';

import isNil from 'lodash-es/isNil';

import Roll from '../model/roll';
import RollResult from '../model/rollResult';
import Bout from '../model/bout';
import Result from '../model/result';
import KIMARITE from '../model/kimarite';

import RIKISHI_CARDS from '../data/rikishi_cards';
import { HENKA_TABLE } from '../data/henkaTable';

import {
  AGGRESSIVE,
  NORMAL,
  HENKA,
  DEFENSIVE
} from '../constants/styleConstants';

import {
  LOSE_2_COLUMNS,
  LOSE_1_COLUMN,
  DEFEAT,
  VICTORY
} from '../constants/resultConstants';

import {
  SPECIAL_ATTACK,
  SPECIAL_KIMARITE,
  FC_KIMARITE,
  TT_KIMARITE,
  PT_KIMARITE
} from '../data/kimariteTable';

const runPreMatch = (
  bout: Bout,
  eastColumns: number,
  eastStyle: number,
  westColumns: number,
  westStyle: number): any => {

  if (eastStyle !== HENKA && westStyle !== HENKA) {
    return;
  }

  if (eastStyle === HENKA && westStyle === HENKA) {
    return;
  }

  const roll: Roll = getRoll();

  const stringResult = resultFromTable(HENKA_TABLE, roll.d20);
  let result = null;
  let newEastColumns = eastColumns;
  let newWestColumns = westColumns;

  switch(stringResult) {
    case VICTORY:
      const myWinner: string = (eastStyle === HENKA) ? bout.eastRikishi : bout.westRikishi;
      const myLoser: string = (myWinner === bout.eastRikishi) ? bout.westRikishi : bout.eastRikishi;
      result = new Result(myWinner, myLoser, KIMARITE.TSUKIOTOSHI);
      break;
    case DEFEAT:
      const myWinner2: string = (eastStyle === HENKA) ? bout.westRikishi : bout.eastRikishi;
      const myLoser2: string = (myWinner2 === bout.eastRikishi) ? bout.eastRikishi : bout.westRikishi;
      result = new Result(myWinner2, myLoser2, KIMARITE.YORIKIRI);
      break;
    case LOSE_2_COLUMNS:
      if (eastStyle === HENKA) {
        newEastColumns -= 2;
        newWestColumns += 2;
      }
      else {
        newEastColumns += 2;
        newWestColumns -= 2;
      }

      break;
    case LOSE_1_COLUMN:
    default:
      if (eastStyle === HENKA) {
        newEastColumns -= 1;
        newWestColumns += 1;
      }
      else {
        newEastColumns += 1;
        newWestColumns -= 1;
      }

      break;
  }

  const whosColumn = (eastStyle === HENKA) ? bout.eastRikishi : bout.westRikishi;

  return {
    eastColumns: newEastColumns,
    westColumns: newWestColumns,
    results: [new RollResult(roll, `${stringResult} - ${(new TitleCasePipe()).transform(whosColumn)}`, result)]
  };
};

const runFullMatch = (
  bout: Bout,
  eastColumns: number,
  eastStyle: number,
  westColumns: number,
  westStyle: number) => {

  const rollResults: RollResult[] = [];

  const firstRoll: Roll = getRoll();

  let rikishiToUse = bout.eastRikishi;
  let style = eastStyle;

  if (firstRoll.column > eastColumns) {
    rikishiToUse = bout.westRikishi;
    eastStyle = westStyle;
  }

  const rikishiTable = RIKISHI_CARDS[rikishiToUse];
  let result = rikishiTable[`${firstRoll.column}-${firstRoll.d12}`];
  rollResults.push( new RollResult(firstRoll, result));

  // is it a matta
  if ( result.toLowerCase().indexOf('matta') !== -1 ) {
    rollResults.push( new RollResult(firstRoll, result) );
    return rollResults;
  }

  // is it a victory
  if ( result.toLowerCase().indexOf('victory') !== -1 ) {

    // switch to an attack in certain circumstances
    if (result.indexOf('@') !== -1 && style === DEFENSIVE) {
      result = result.replace('victory', 'attack');
    }
    else {
      const endResults = endMatch(rikishiToUse, bout, result);
      endResults.forEach( (rez: RollResult) => {
        rollResults.push(rez);
      });

      return rollResults;
    }
  }

  return [new RollResult(firstRoll, 'none')];
};

const endMatch = (
  winner: string,
  bout: Bout,
  result: string
): RollResult[] => {

  const loser = (bout.eastRikishi === winner) ? bout.westRikishi : bout.eastRikishi;
  const rollResults: RollResult[] = [];
  const kimariteRoll1 = getRoll();

  let kimariteTable = FC_KIMARITE;

  if (result.indexOf('tt') !== -1) {
    kimariteTable = TT_KIMARITE;
  }
  else if ( result.indexOf('pt') !== -1) {
    kimariteTable = PT_KIMARITE;
  }

  const kimariteResult1 = resultFromTable(kimariteTable, kimariteRoll1.d20);
  let boutResult = undefined;

  if (kimariteResult1 !== SPECIAL_ATTACK) {
    boutResult = new Result(winner, loser, kimariteResult1);
  }

  rollResults.push( new RollResult(kimariteRoll1, kimariteResult1, boutResult));

  // special attack
  if (isNil(boutResult)) {
    const kimariteRoll2 = getRoll();
    const kimariteResult2 = resultFromTable(SPECIAL_KIMARITE, kimariteRoll2.d20);
    boutResult = new Result(winner, loser, kimariteResult2);
    rollResults.push( new RollResult(kimariteRoll2, kimariteResult2, boutResult));
  }

  return rollResults;
};

const getRoll = (): Roll => {
  const roll = new Roll();
  roll.roll();

  return roll;
};

const resultFromTable = (table, value) => {
  const row = table.find( (row) => {
    if ( value < row.min ) {
      return false;
    }

    if ( !isNil(row.max) && value > row.max ) {
      return false;
    }

    return true;
  });

  return row.result;
};

export { runFullMatch, runPreMatch };
