import Result from './result';

class Bout {

  _eastRikishi: String;
  _westRikishi: String;
  _result: Result;
  _day: number;

  constructor( theEast: String, theWest: String ) {
    this._eastRikishi = theEast;
    this._westRikishi = theWest;
  }

  get eastRikishi() { return this._eastRikishi; }

  get westRikishi() { return this._westRikishi; }

  get result(): Result { return this._result; }

  set result(aResult: Result) {
    this._result = aResult;
  }

  get day(): number { return this._day; }

  set day(aDay: number) {
    this._day = aDay;
  }

}

export default Bout;
