import Banzuke from '../model/banzuke';
import BanzukeEntry from '../model/banzukeEntry';
import DaySchedule from '../model/day_schedule';
import Schedule from '../model/schedule';
import Bout from '../model/bout';
import Rank from '../model/rank';

import isNil from 'lodash-es/isNil';

const buildSchedule = (day: number, banzuke: Banzuke, schedule: Schedule): DaySchedule {

  // schedule in thirds
  const aThird = Math.floor(banzuke.list.length / 3);
  // first third
  doScheduleChunk(banzuke.list.slice(0, aThird), banzuke, schedule);
  // last third
  doScheduleChunk(banzuke.list.slice(2 * aThird), banzuke, schedule);
  // middle
  doScheduleChunk(banzuke.list.slice(aThird, 2 * aThird), banzuke, schedule);
  return null;
};

const doScheduleChunk = (rikishi: BanzukeEntry[], banzuke: Banzuke, schedule: Schedule): void => {
  rikishi.forEach( (r: BanzukeEntry) => {
    scheduleRikishi(r, banzuke, schedule);
  });
};

const scheduleRikishi = (rikishi: BanzukeEntry, banzuke: Banzuke, schedule: Schedule): void => {
  const rankPossibilities: BanzukeEntry[] = findRankRikishiOptions(rikishi, banzuke, schedule);
};

const findRankRikishiOptions = (rikishi: BanzukeEntry, banzuke: Banzuke, schedule: Schedule): BanzukeEntry[] => {
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

    const alreadyScheduled = schedule.days.find( (day: DaySchedule) => {
      const matchingBout = day.bouts.find( (bout: Bout) => {
        return bout.eastRikishi === entry.name || bout.westRikishi === entry.name;
      });

      return !isNil(matchingBout);
    });

    return isNil(alreadyScheduled);
  });

  const sortedListOfPossibilities: BanzukeEntry[] = sortByFightOrder(listOfPossibilities);

  return sortedListOfPossibilities;
};

const sortByFightOrder = (opponents: BanzukeEntry[]): BanzukeEntry[] => {

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
