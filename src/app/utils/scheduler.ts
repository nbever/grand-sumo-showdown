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

  const makuuchi = getDivisionWrestlers(banzuke, DIV_MAKUUCHI);
  const juryo = getDivisionWrestlers(banzuke, DIV_JURYO);

  // just doing makuuchi now...
  [makuuchi, juryo].forEach( (div) => {
    const fightMatrix = buildFightMatrix(div, banzuke, schedule);
    let unscheduledRikishi: BanzukeEntry[] = [];

    // schedule in thirds
    const aThird = Math.floor(div.length / 3);
    // first third
    unscheduledRikishi = unscheduledRikishi.concat( doScheduleChunk(div.slice(0, aThird), daySchedule, day, fightMatrix) );
    // last third
    unscheduledRikishi = unscheduledRikishi.concat( doScheduleChunk(div.slice(2 * aThird), daySchedule, day, fightMatrix) );
    // middle
    unscheduledRikishi = unscheduledRikishi.concat( doScheduleChunk(div.slice(aThird, 2 * aThird), daySchedule, day, fightMatrix) );

    console.log(unscheduledRikishi.join());

    let i = 0;
    while (unscheduledRikishi.length !== 0 && i < 1000) {
      unscheduledRikishi = fixScheduleIssues(unscheduledRikishi, banzuke, daySchedule, fightMatrix);
      console.log(unscheduledRikishi.join());
      i++;
    }

    console.log(`Took ${i} iterations.`);
  });

  return daySchedule;
};

const getDivisionWrestlers = (banzuke: Banzuke, division: Rank[]) => {
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

  return listOfPossibilities;
}

const doScheduleChunk = (rikishi: BanzukeEntry[], schedule: DaySchedule, day: number, matrix): BanzukeEntry[] => {

  const unscheduledRikishi: BanzukeEntry[] = [];

  rikishi.forEach( (r: BanzukeEntry) => {

    const scheduledAlready: boolean = alreadyScheduled(r, schedule);

    if (scheduledAlready === true) {
      return;
    }

    const bout: Bout = scheduleRikishi(r, schedule, day, matrix);

    if (isNil(bout)) {
      unscheduledRikishi.push(r);
      return;
    }

    schedule.bouts.push(bout);
  });

  return unscheduledRikishi;
};

const alreadyScheduled = (rikishi: BanzukeEntry, schedule: DaySchedule): boolean => {
  return schedule.bouts.some( (b: Bout): boolean => {
    return b.eastRikishi === rikishi.name || b.westRikishi === rikishi.name;
  });
};

const scheduleRikishi = (rikishi: BanzukeEntry, schedule: DaySchedule, day: number, matrix): Bout => {
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

const findOpenBoutOptions = (rikishi: BanzukeEntry, schedule: DaySchedule, day: number, matrix): BanzukeEntry[] => {
  const allOptions = matrix[rikishi.name];

  return allOptions.filter( (possibleOpponent: BanzukeEntry) => {
    const alreadyScheduledToday = schedule.bouts.some( (bout: Bout) => {
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

const fixScheduleIssues = (unscheduledRikishi: BanzukeEntry[], banzuke: Banzuke, schedule: DaySchedule, matrix): BanzukeEntry[] => {
  const stillNoSolution: BanzukeEntry[] = [];

  unscheduledRikishi.forEach( (rikishi: BanzukeEntry) => {
    if (alreadyScheduled(rikishi, schedule)) {
      return;
    }

    if (createNewBoutIfPossible(rikishi.name, unscheduledRikishi, schedule, matrix)) {
      return;
    }

    console.log(`Trying to schedule for ${rikishi.name}...`);

    const {bout: swapBout, newOpponent} = findASwapBout(rikishi, schedule, matrix);

    if (isNil(swapBout)) {
      return;
    }

    console.log(`Fighting ${newOpponent.name} now.`);

    let newLeftOver: string;
    if (swapBout.eastRikishi === newOpponent.name) {
      newLeftOver = swapBout.westRikishi;
      swapBout.westRikishi = rikishi.name;
    }
    else {
      newLeftOver = swapBout.eastRikishi;
      swapBout.eastRikishi = rikishi.name;
    }

    if (!createNewBoutIfPossible(newLeftOver, unscheduledRikishi, schedule, matrix)) {
      console.log(`No available fight for ${newLeftOver}`);
      stillNoSolution.push( banzuke.list.find( (entry: BanzukeEntry) => entry.name === newLeftOver) );
    }
  });

  return stillNoSolution;
};

const createNewBoutIfPossible = (newLeftOver: string, unscheduledRikishi: BanzukeEntry[], schedule: DaySchedule, matrix): boolean => {

  const foundRikishi: BanzukeEntry = matrix[newLeftOver].find( (needToFight: BanzukeEntry) => {
    const availableRikishi: BanzukeEntry = unscheduledRikishi.find( (openRikishi: BanzukeEntry) => {
      if (alreadyScheduled(openRikishi, schedule)) {
        return false;
      }
      return openRikishi.name === needToFight.name;
    });

    if (isNil(availableRikishi)) {
      return false;
    }

    const newBout = new Bout(newLeftOver, availableRikishi.name);
    newBout.day = schedule.day;
    schedule.bouts.push(newBout);
    console.log(`Found a matchup for ${newLeftOver} against ${availableRikishi.name}`);

    return true;
  });

  return !isNil(foundRikishi);
}

const findASwapBout = (rikishi: BanzukeEntry, schedule: DaySchedule, matrix): any => {
  const myList = matrix[rikishi.name];
  const randomFactor = myList.length > 2 ? 2 : myList.length - 1;

  const newOpponent: BanzukeEntry = myList[Math.round(Math.random() * randomFactor)];

  const bout: Bout = schedule.bouts.find( (sBout: Bout) => {
    return sBout.eastRikishi === newOpponent.name || sBout.westRikishi === newOpponent.name;
  });

  return {bout, newOpponent};
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
