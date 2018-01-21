import Banzuke from '../model/banzuke';
import BanzukeEntry from '../model/banzukeEntry';
import DaySchedule from '../model/day_schedule';
import Schedule from '../model/schedule';
import Bout from '../model/bout';
import Rank, {
  DIV_MAKUUCHI,
  DIV_JURYO,
  DIV_MAKUSHITA
} from '../model/rank';
import SIDE from '../model/side';

import isNil from 'lodash-es/isNil';

const buildSchedule = (day: number, banzuke: Banzuke, schedule: Schedule): DaySchedule => {

  const daySchedule: DaySchedule = schedule.days[day - 1];

  const makuuchi = getDivisionWreslters(banzuke, DIV_MAKUUCHI);
  const juryo = getDivisionWreslters(banzuke, DIV_JURYO);

  // just doing makuuchi now...
  const fightMatrix = buildFightMatrix(makuuchi, banzuke, schedule);

  // schedule in thirds
  const aThird = Math.floor(makuuchi.length / 3);
  // first third
  doScheduleChunk(makuuchi.slice(0, aThird), schedule, day, fightMatrix);
  // last third
  doScheduleChunk(makuuchi.slice(2 * aThird), schedule, day, fightMatrix);
  // middle
  doScheduleChunk(makuuchi.slice(aThird, 2 * aThird), schedule, day, fightMatrix);

  return daySchedule;
};

const getDivisionWreslters = (banzuke: Banzuke, division: Rank[]) => {
  return banzuke.list.filter( (entry: BanzukeEntry) => {
    const match = division.some( (divRank: Rank) => {
      return divRank === entry.rank;
    });

    return match;
  });
};

const buildFightMatrix = (division: BanzukeEntry[], banzuke: Banzuke, schedule: Schedule) => {
  const matrix = {};

  division.forEach( (entry: BanzukeEntry) => {
    matrix[entry.name] = buildRikishiOptions(entry, banzuke, schedule);
  });

  return matrix;
}

const buildRikishiOptions = (rikishi: BanzukeEntry, banzuke: Banzuke, schedule: Schedule) => {
  // find the range
  let highestRank = Math.max(rikishi.numericalRank - 8, 0);
  const lowRankToUse: Rank = findLowRank(rikishi, banzuke);
  const lowList: BanzukeEntry[] = banzuke.getListByRank(lowRankToUse);
  const lowListRank = lowList[lowList.length - 1].numericalRank;

  if (rikishi.numericalRank + 7 > lowListRank) {
    highestRank = highestRank - (7 - (lowListRank - rikishi.numericalRank));
  }

  const rangeToFight = banzuke.list.slice(highestRank, highestRank + 16);

  // remove any that I've already fought
  const listOfPossibilities = rangeToFight.filter( (entry: BanzukeEntry) => {
    if (entry === rikishi) {
      return false;
    }

    const alreadyFoughtThem = schedule.days.some( (pastDay: DaySchedule) => {
      const foughtThem = pastDay.bouts.some( (oldBout: Bout) => {
        return ((oldBout.eastRikishi === rikishi.name || oldBout.westRikishi === rikishi.name) &&
               (oldBout.eastRikishi === entry.name || oldBout.westRikishi === entry.name));
      });

      return foughtThem;
    });

    return !alreadyFoughtThem;
  });

  // sorts in place... changes the array
  sortByFightOrder(rikishi, highestRank, lowListRank, listOfPossibilities);
  // const sortedListOfPossibilities: BanzukeEntry[] = sortByFightOrder(rikishi, highestRank, lowListRank, listOfPossibilities);

  return listOfPossibilities;
}

const doScheduleChunk = (rikishi: BanzukeEntry[], schedule: Schedule, day: number, matrix:? any): void => {

  rikishi.forEach( (r: BanzukeEntry) => {

    const alreadyScheduled: boolean = schedule.days[day - 1].bouts.some( (b: Bout): boolean => {
      return b.eastRikishi === r.name || b.westRikishi === r.name;
    });

    if (alreadyScheduled === true) {
      return;
    }

    const bout: Bout = scheduleRikishi(r, schedule, day, matrix);

    if (isNil(bout)) {
      return;
    }

    schedule.days[day - 1].bouts.push(bout);
  });
};

const scheduleRikishi = (rikishi: BanzukeEntry, schedule: Schedule, day: number, matrix): Bout => {
  const rankPossibilities: BanzukeEntry[] = findOpenBoutOptions(rikishi, schedule, day, matrix);

  if (rankPossibilities.length === 0) {
    return;
  }

  let east = rikishi.name;
  let west = rankPossibilities[0].name;

  if (rikishi.numericalRank > rankPossibilities[0].numericalRank && rankPossibilities[0].side === SIDE.EAST) {
    east = rankPossibilities[0].name;
    west = rikishi.name;
  }

  const bout = new Bout(east, west);
  bout.day = day;

  return bout;
};

const findOpenBoutOptions = (rikishi: BanzukeEntry, schedule: Schedule, day: number, matrix): BanzukeEntry[] => {
  const allOptions = matrix[rikishi.name];

  return allOptions.filter( (possibleOpponent: BanzukeEntry) => {
    const alreadyScheduledToday = schedule.days[day - 1].bouts.some( (bout: Bout) => {
        return bout.eastRikishi === possibleOpponent.name || bout.westRikishi === possibleOpponent.name;
    });

    return !alreadyScheduledToday;
  });
};

const sortByFightOrder = (rikishi: BanzukeEntry, highRank: number, lowRank: number, opponents: BanzukeEntry[]) => {

  const idealFirstMatch = (highRank - rikishi.numericalRank) + 15;
  const newOrder = opponents.sort( (entryA: BanzukeEntry, entryB: BanzukeEntry): number => {

    const aDistance: number = Math.abs(entryA.numericalRank - idealFirstMatch);
    const bDistance: number = Math.abs(entryB.numericalRank - idealFirstMatch);

    if (aDistance < bDistance) {
      return -1;
    } else if ( bDistance < aDistance ) {
      return 1;
    }

    return 0;
  });
};

const findLowRank = (rikishi: BanzukeEntry, banzuke: Banzuke): Rank => {
  switch (rikishi.rank) {
    case Rank.YOKOZUNA:
    case Rank.OZEKI:
    case Rank.SEKIWAKE:
    case Rank.KOMUSUBI:
    case Rank.MAEGASHIRA:
      return Rank.MAEGASHIRA;
    default:
      return rikishi.rank;
  }
};

export default buildSchedule;
