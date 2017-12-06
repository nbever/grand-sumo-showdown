import Rank from './rank';
import SIDE from './side';
import Result from './result';

class BanzukeEntry {
  _name: String;
  _rank: Rank;
  _number: Number;
  _side: SIDE;
  _record: Result[];

  constructor( aName: String, aRank: Rank, aNumber: Number, aSide: SIDE) {
    this._name = aName;
    this._rank = aRank;
    this._number = aNumber;
    this._side = aSide;
    this._record = new Array(15).fill(new Result());
  }

  get name() { return this._name; }

  get rank() { return this._rank; }

  get number() { return this._number; }

  get side() { return this._side; }

  set side( aSide: SIDE ) { this._side = aSide; }

  get rankId() { return `${this.rank}${this.number}${this.side}`; }

  get results() { return this._record; }

  toString(): String {
    return this.name;
  }
}

export default BanzukeEntry;
