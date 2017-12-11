import { TitleCasePipe } from '@angular/common';

import { LOSE, MATTA } from '../constants/resultConstants';

import isNil from 'lodash-es/isNil';

import Roll from '../model/roll';
import RollResult from '../model/rollResult';
import Bout from '../model/bout';
import Result from '../model/result';
import KIMARITE from '../model/kimarite';

import RIKISHI_CARDS from '../data/rikishi_cards';
import { HENKA_TABLE } from '../data/henkaTable';
import { INJURY_TABLE } from '../data/injuryTable';
import { ATTACK_TABLE } from '../data/attackTable';
import { MATTA_TABLE } from '../data/mattaTable';

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

  switch ( stringResult ) {
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
    results: [new RollResult(roll, stringResult, whosColumn, result)]
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
  let otherRikishi = bout.westRikishi;
  const style = eastStyle;

  if (firstRoll.column > eastColumns) {
    rikishiToUse = bout.westRikishi;
    otherRikishi = bout.eastRikishi;
    eastStyle = westStyle;
  }

  const rikishiTable = RIKISHI_CARDS[rikishiToUse];
  let result = rikishiTable[`${firstRoll.column}-${firstRoll.d12}`];
  rollResults.push( new RollResult(firstRoll, result, rikishiToUse));

  console.log(`${rollResults.toString()}: ${result}`);

  // is it a matta
  if ( result.toLowerCase().indexOf('matta') !== -1 ) {

    const mattaRoll = getRoll();
    const mattaResult = resultFromTable(MATTA_TABLE, mattaRoll.d20);
    rollResults.push(new RollResult(mattaRoll, mattaResult, rikishiToUse));

    return rollResults;
  }

  // is it an injury
  if ( result.toLowerCase().indexOf('injury') !== -1) {
    const injuryRoll = getRoll();
    const injuryResult = resultFromTable(INJURY_TABLE, injuryRoll.d20);

    rollResults.push( new RollResult(injuryRoll, injuryResult, rikishiToUse));
    const endResults2 = endMatch(otherRikishi, bout, result, rikishiToUse);
    pushAllResults(rollResults, endResults2);

    return rollResults;
  }

  // is it a victory
  if ( result.toLowerCase().indexOf('victory') !== -1 ) {

    // switch to an attack in certain circumstances
    if (result.indexOf('@') !== -1 && style === DEFENSIVE) {
      result = result.replace('victory', 'attack');
    }
    else {
      const endResults3 = endMatch(rikishiToUse, bout, result, rikishiToUse);
      pushAllResults(rollResults, endResults3);

      return rollResults;
    }

  }

  // it's an attack
  let key = 'PT';

  if ( result.indexOf('tt') !== -1 ) {
    key = 'TT';
  }
  else if ( result.indexOf('fc') !== -1 ) {
    key = 'FC';
  }

  const attackerGrade = RIKISHI_CARDS[rikishiToUse][`${key}OFF`];
  let defenderGrade = RIKISHI_CARDS[otherRikishi][`${key}DEF`];

  // aggressive knocks your defense to an f
  if ((otherRikishi === bout.eastRikishi && eastStyle === AGGRESSIVE) ||
      (otherRikishi === bout.westRikishi && westStyle === AGGRESSIVE)) {
    defenderGrade = 'f';
  }

  const attackTable = ATTACK_TABLE[attackerGrade][defenderGrade];

  const attackRoll = getRoll();
  const attackResult = resultFromTable(attackTable, attackRoll.d20);
  let winningRikishi = rikishiToUse;

  if ( attackResult === LOSE || (attackResult.indexOf('*') !== -1)) {
    winningRikishi = otherRikishi;
  }

  const endResults = endMatch(winningRikishi, bout, attackResult, rikishiToUse);
  pushAllResults(rollResults, endResults);

  return rollResults;
};

const pushAllResults = (results: RollResult[], newResults: RollResult[]): RollResult[] => {
  newResults.forEach( (rez: RollResult) => {
    results.push(rez);
  });

  return results;
};

const endMatch = (
  winner: string,
  bout: Bout,
  result: string,
  rikishiToUse: string
): RollResult[] => {

  const loser = (bout.eastRikishi === winner) ? bout.westRikishi : bout.eastRikishi;
  const rollResults: RollResult[] = [];
  const kimariteRoll1 = getRoll();

  let kimariteTable = PT_KIMARITE;

  if (result.indexOf('tt') !== -1) {
    kimariteTable = TT_KIMARITE;
  }
  else if ( result.indexOf('fc') !== -1) {
    kimariteTable = FC_KIMARITE;
  }

  const kimariteResult1 = resultFromTable(kimariteTable, kimariteRoll1.d20);
  let boutResult;

  if (kimariteResult1 !== SPECIAL_ATTACK) {
    boutResult = new Result(winner, loser, kimariteResult1);
  }

  rollResults.push( new RollResult(kimariteRoll1, kimariteResult1, rikishiToUse, boutResult));

  // special attack
  if (isNil(boutResult)) {
    const kimariteRoll2 = getRoll();
    const kimariteResult2 = resultFromTable(SPECIAL_KIMARITE, kimariteRoll2.d20);
    boutResult = new Result(winner, loser, kimariteResult2);
    rollResults.push( new RollResult(kimariteRoll2, kimariteResult2, rikishiToUse, boutResult));
  }

  return rollResults;
};

const getRoll = (): Roll => {
  const roll = new Roll();
  roll.roll();

  return roll;
};

const resultFromTable = (table, value) => {
  const row = table.find( (row2) => {
    if ( value < row2.min ) {
      return false;
    }

    if ( !isNil(row2.max) && value > row2.max ) {
      return false;
    }

    return true;
  });

  return row.result;
};

export { runFullMatch, runPreMatch };
