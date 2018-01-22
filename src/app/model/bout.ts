import Result from './result';

class Bout {

  _eastRikishi: string;
  _westRikishi: string;
  _result: Result;
  _day: number;

  constructor( theEast: string, theWest: string ) {
    this._eastRikishi = theEast;
    this._westRikishi = theWest;
  }

  get eastRikishi() { return this._eastRikishi; }

  set eastRikishi(aRikishi) { this._eastRikishi = aRikishi; }

  get westRikishi() { return this._westRikishi; }

  set westRikishi(aRikishi) { this._westRikishi = aRikishi; }

  get result(): Result { return this._result; }

  set result(aResult: Result) {
    this._result = aResult;
  }

  get day(): number { return this._day; }

  set day(aDay: number) {
    this._day = aDay;
  }

  swap = () => {
    const temp = this._eastRikishi;
    this._eastRikishi = this._westRikishi;
    this._westRikishi = temp;
  }

}

export default Bout;
