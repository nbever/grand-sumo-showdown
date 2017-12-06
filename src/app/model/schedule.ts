import DaySchedule from './day_schedule';


class Schedule {

  _days: DaySchedule[] = [];

  constructor() {

    for ( let i = 0; i < 15; i++ ) {
      this.days.push( new DaySchedule( (i + 1) ) );
    }
  }

  get days(): DaySchedule[] {
    return this._days;
  }
}

export default Schedule;
