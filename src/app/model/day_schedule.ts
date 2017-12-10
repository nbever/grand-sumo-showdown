import Bout from './bout';
import Injury from './injury';

class DaySchedule {

  _bouts: Bout[] = [];
  _day: number;
  _injuredRikishi: Injury[] = [];

  constructor(aDay: number) {
    this._day = aDay;
  }

  get day() { return this._day; }

  get bouts() { return this._bouts; }

  get injuredRikishi() { return this._injuredRikishi; }
}

export default DaySchedule;
