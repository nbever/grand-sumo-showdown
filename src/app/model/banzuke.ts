import isNil from 'lodash-es/isNil';
import BanzukeEntry from './banzukeEntry';
import Rank from './rank';
import SIDE from './side';

class Banzuke {

  _list: BanzukeEntry[];

  get list() { return this._list; }

  getListByRank = ( rank: Rank ) => {
    const entries: BanzukeEntry[] = this.list.filter( (entry: BanzukeEntry) => {
      const eRank = entry.rank;
      return eRank === Rank[rank] || eRank === rank;
    });

    return entries;
  }

  addEntry = ( entry: BanzukeEntry ): boolean => {

    if (isNil(entry)) {
      return false;
    }

    if (isNil(this._list)) {
      this._list = [];
    }

    const index = this._list.findIndex( (previousEntries: BanzukeEntry) => {
      return entry.rankId === previousEntries.rankId;
    });

    if ( index !== -1 ) {
      return false;
    }

    this._list.push( entry );
    this._list = this._list.sort( this.sortRanks );

    return true;
  }

  sortRanks = (a, b): number => {

    if (a.rank !== b.rank) {
      const aIndex: number = Object.keys(Rank).findIndex( (rankItem: Rank) => {
        return Rank[rankItem] === a.rank;
      });

      const bIndex: number = Object.keys(Rank).findIndex( (rankItem: Rank) => {
        return Rank[rankItem] === b.rank;
      });

      return (aIndex - bIndex);
    }

    if ( a.number !== b.number ) {
      return a.number - b.number;
    }

    if ( a.side === SIDE.EAST ) {
      return -1;
    }

    return 1;
  }
}

export default Banzuke;
