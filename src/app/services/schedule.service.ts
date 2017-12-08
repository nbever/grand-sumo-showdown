import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import isNil from 'lodash-es/isNil';
import flattenDeep from 'lodash-es/flattenDeep';

import Schedule from '../model/schedule';
import Bout from '../model/bout';
import DaySchedule from '../model/day_schedule';

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
}

export default ScheduleService;
