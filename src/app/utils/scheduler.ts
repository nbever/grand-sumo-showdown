import Banzuke from '../model/banzuke';
import BanzukeEntry from '../model/banzukeEntry';
import DaySchedule from '../model/day_schedule';
import Schedule from '../model/schedule';
import Bout from '../model/bout';
import Rank from '../model/rank';
import SIDE from '../model/side';

import isNil from 'lodash-es/isNil';

const buildSchedule = (day: number, banzuke: Banzuke, schedule: Schedule): DaySchedule => {

  const daySchedule: DaySchedule = schedule.days[day - 1];

  // schedule in thirds
  const aThird = Math.floor(banzuke.list.length / 3);
  // first third
  doScheduleChunk(banzuke.list.slice(0, aThird), banzuke, schedule, day);
  // last third
  doScheduleChunk(banzuke.list.slice(2 * aThird), banzuke, schedule, day);
  // middle
  doScheduleChunk(banzuke.list.slice(aThird, 2 * aThird), banzuke, schedule, day);

  return daySchedule;
};

const doScheduleChunk = (rikishi: BanzukeEntry[], banzuke: Banzuke, schedule: Schedule, day: number): void => {

  rikishi.forEach( (r: BanzukeEntry) => {

    const alreadyScheduled: boolean = schedule.days[day - 1].bouts.some( (b: Bout): boolean => {
      return b.eastRikishi === r.name || b.westRikishi === r.name;
    });

    if (alreadyScheduled === true) {
      return;
    }

    const bout: Bout = scheduleRikishi(r, banzuke, schedule, day);
    schedule.days[day - 1].bouts.push(bout);
  });
};

const scheduleRikishi = (rikishi: BanzukeEntry, banzuke: Banzuke, schedule: Schedule, day: number): Bout => {
  const rankPossibilities: BanzukeEntry[] = findRankRikishiOptions(rikishi, banzuke, schedule, day);

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

const findRankRikishiOptions = (rikishi: BanzukeEntry, banzuke: Banzuke, schedule: Schedule, day: number): BanzukeEntry[] => {
  // find the range
  let highestRank = Math.max(rikishi.numericalRank - 8, 0);
  const lowRankToUse: Rank = findLowRank(rikishi, banzuke);
  const lowList: BanzukeEntry[] = banzuke.getListByRank(lowRankToUse);
  const lowListRank = lowList[lowList.length - 1].numericalRank;

  if (rikishi.numericalRank + 7 > lowListRank) {
    highestRank = highestRank - (lowListRank - rikishi.numericalRank);
  }

  const rangeToFight = banzuke.list.slice(highestRank, highestRank + 16);

  // remove any that I've already fought
  const listOfPossibilities = rangeToFight.filter( (entry: BanzukeEntry) => {
    if (entry === rikishi) {
      return false;
    }

    const alreadyScheduledToday = schedule.days[day - 1].bouts.some( (bout: Bout) => {
        return bout.eastRikishi === entry.name || bout.westRikishi === entry.name;
    });

    if (alreadyScheduledToday === true) {
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
