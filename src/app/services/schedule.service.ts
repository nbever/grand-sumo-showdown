import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import isNil from 'lodash-es/isNil';
import flattenDeep from 'lodash-es/flattenDeep';

import {
  INJURY_RESIGN_ALL,
  INJURY_RESIGN,
  INJURY_RESIGN_AND_3,
  INJURY_RESIGN_AND_2,
  INJURY_RESIGN_AND_NEXT,
  INJURY_RESIGN_ALL_AND_NEXT
} from '../constants/resultConstants';

import Schedule from '../model/schedule';
import Bout from '../model/bout';
import DaySchedule from '../model/day_schedule';
import RollResult from '../model/rollResult';
import Injury from '../model/injury';

@Injectable()
class ScheduleService {

  _fullSchedule: Schedule;

  private scheduleChanged = new Subject<DaySchedule>();
  scheduleAnnouncement$ = this.scheduleChanged.asObservable();

  get fullSchedule() {

    if (isNil(this._fullSchedule)) {
      this._fullSchedule = new Schedule();
    }

    return this._fullSchedule;
  }

  getDaySchedule = (day: number) => {
    return this.fullSchedule.days[day - 1];
  }

  setBout = (day: number, bout: Bout, index?: number) => {

    const daySchedule: DaySchedule = this.getDaySchedule(day);

    if (!isNil(index)) {
      daySchedule.bouts[index] = bout;
    } else {
      daySchedule.bouts.push( bout );
    }

    this.scheduleChanged.next(daySchedule);
  }

  deleteBout = (day: number, index: number) => {
    const daySchedule: DaySchedule = this.getDaySchedule(day);

    daySchedule.bouts.splice(index, 1);

    this.scheduleChanged.next(daySchedule);
  }

  reportInjury = (dayOccurred: number, result: RollResult) => {
    switch ( result.result ) {
      case INJURY_RESIGN:
        break;
      case INJURY_RESIGN_AND_NEXT:
        this.fillResignations(dayOccurred, 1, result);
        break;
      case INJURY_RESIGN_AND_2:
        this.fillResignations(dayOccurred, 2, result);
        break;
      case INJURY_RESIGN_AND_3:
        this.fillResignations(dayOccurred, 3, result);
        break;
      case INJURY_RESIGN_ALL:
      case INJURY_RESIGN_ALL_AND_NEXT:
      default:
          this.fillResignations(dayOccurred, 15, result);
        break;
    }
  }

  fillResignations = (dayOccurred: number, daysToResign: number, result: RollResult) => {

    const dayToStopAt = Math.min(dayOccurred + daysToResign, 15);


    for ( let i = dayOccurred + 1; i <= dayToStopAt; i++ ) {
      const canSchedule = (i === (dayOccurred + 1)) ? true : false;
      const injury = new Injury(result.rikishi, canSchedule);

      this.getDaySchedule(i).injuredRikishi.push(injury);
    }
  }

  getRikishiBouts = ( rikishi: String ): Bout[] => {

    const allBouts = this.fullSchedule.days.map( (daySchedule: DaySchedule) => {
      const bouts: Bout[] = daySchedule.bouts.filter( (bout) => {
        if (bout.eastRikishi === rikishi || bout.westRikishi === rikishi) {
          return true;
        }

        return false;
      });

      return bouts;
    });

    const fights = flattenDeep(allBouts);
    return <Bout[]>fights;
  }

  getListOfRikishiScheduled = (daySchedule: DaySchedule): string[] => {
    const rikishiScheduledToday: any = flattenDeep(daySchedule.bouts.map( (bout: Bout) => {
      return [bout.eastRikishi, bout.westRikishi];
    }));

    const eliminatedRikishi = daySchedule.injuredRikishi.filter( (rikishi: Injury) => {
      return !rikishi.canSchedule;
    }).map( (injury: Injury) => {
      return injury.rikishi;
    }).forEach( (rikishi: string) => {
      rikishiScheduledToday.push(rikishi);
    });

    return rikishiScheduledToday;
  }

  getListOfOpponentsFought = (rikishi: string) => {
    const bouts: Bout[] = this.getRikishiBouts(rikishi);

    const opponentNames: string[] = bouts.map( (bout: Bout) => {
      if ( bout.eastRikishi === rikishi) {
        return bout.westRikishi;
      }

      return bout.eastRikishi;
    });

    return opponentNames;
  }
}

export default ScheduleService;
