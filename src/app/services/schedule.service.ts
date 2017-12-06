import { Injectable } from '@angular/core';

import isNil from 'lodash-es/isNil';
import flattenDeep from 'lodash-es/flattenDeep';

import Schedule from '../model/schedule';
import Bout from '../model/bout';
import DaySchedule from '../model/day_schedule';

@Injectable()
class ScheduleService {

  _fullSchedule: Schedule;

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
