import Bout from './bout';

class DaySchedule {

  _bouts: Bout[] = [];
  _day: number;

  constructor(aDay: number) {
    this._day = aDay;
  }

  get day() { return this._day; }

  get bouts() { return this._bouts; }
}

export default DaySchedule;
