import Rank from './rank';
import SIDE from './side';
import Result from './result';

class BanzukeEntry {
  _name: string;
  _rank: Rank;
  _number: number;
  _side: SIDE;
  _record: Result[];
  _numericalRank: number;

  constructor( aName: string, aRank: Rank, aNumber: number, aSide: SIDE, aNumericalRank: number) {
    this._name = aName;
    this._rank = aRank;
    this._number = aNumber;
    this._side = aSide;
    this._numericalRank = aNumericalRank;
    this._record = new Array(15).fill(new Result());
  }

  get name(): string { return this._name; }

  get rank(): Rank { return this._rank; }

  get numericalRank(): number {
    return this._numericalRank;
  }

  get number() { return this._number; }

  get side() { return this._side; }

  set side( aSide: SIDE ) { this._side = aSide; }

  get rankId() { return `${this.rank}${this.number}${this.side}`; }

  get results() { return this._record; }

  setResult = (day: number, result: Result) => {
    this.results[day] = result;
  }

  toString(): string {
    return this.name;
  }
}

export default BanzukeEntry;
