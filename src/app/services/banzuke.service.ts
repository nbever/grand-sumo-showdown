import {Injectable} from '@angular/core';
import isNil from 'lodash-es/isNil';

import RIKISHI_CARDS from '../data/rikishi_cards';
import Banzuke from '../model/banzuke';
import BanzukeEntry from '../model/banzukeEntry';
import Rank from '../model/rank';
import Bout from '../model/bout';
import Result from '../model/Result';
import SIDE from '../model/side';

@Injectable()
class BanzukeService {

  _banzuke: Banzuke;

  constructor() {

  }

  get banzuke() {

    if ( isNil( this._banzuke ) ) {
      this._banzuke = this.initializeBanzuke();
    }

    return this._banzuke;
  }

  initializeBanzuke = (): Banzuke => {

    const banzuke: Banzuke = new Banzuke();

    for ( const key in RIKISHI_CARDS ) {
      const entry: BanzukeEntry = this.buildBanzukeEntry( RIKISHI_CARDS[key], key );
      const result: boolean = banzuke.addEntry( entry );

      if ( result === false ) {
        entry.side = SIDE.WEST;
        banzuke.addEntry( entry );
      }
    }

    banzuke.list.forEach( (entry: BanzukeEntry, index: number) => {
      entry.numericalRank = index;
    });

    return banzuke;
  }

  buildBanzukeEntry = (rikishiData: any, name: string): BanzukeEntry => {

    const lastRank = rikishiData['Last Rank'];

    const rank: Rank = this.buildRank( lastRank );

    const sideChar = lastRank.substring(lastRank.length - 2);
    const side: SIDE = SIDE.EAST;
    const number: number = parseInt( lastRank.substring(1), 10 );

    const entry: BanzukeEntry = new BanzukeEntry( name, rank, number, side );
    return entry;
  }

  buildRank = (lastRank: String): Rank => {

    if ( lastRank.startsWith('ms') ) {
      return Rank.MAKUSHITA;
    }

    const rankChar = lastRank.substring(0, 1).toUpperCase();

    let rank: Rank = Rank.JURYO;

    switch ( rankChar ) {
      case Rank.MAEGASHIRA:
        rank = Rank.MAEGASHIRA;
        break;
      case Rank.KOMUSUBI:
        rank = Rank.KOMUSUBI;
        break;
      case Rank.SEKIWAKE:
        rank = Rank.SEKIWAKE;
        break;
      case Rank.OZEKI:
        rank = Rank.OZEKI;
        break;
      case Rank.YOKOZUNA:
        rank = Rank.YOKOZUNA;
        break;
      case Rank.JURYO:
        rank = Rank.JURYO;
        break;
      default:
        rank = Rank.MAKUSHITA;
        break;
    }

    return rank;
  }

  getWinTotal = (rikishi: BanzukeEntry): number => {
    return this.countResults(rikishi, true);
  }

  getLossTotal = (rikishi: BanzukeEntry): number => {
    return this.countResults(rikishi, false);
  }

  countResults = (rikishi: BanzukeEntry, wins: boolean = true): number => {
    const results = rikishi.results.map( (result: Result): number => {
      if (result.winner === rikishi.name && wins === true) {
        return 1;
      } else if (result.loser === rikishi.name && wins !== true) {
        return 1;
      }

      return 0;
    }).reduce( (total: number, win: number) => {
      return total + win;
    });

    return results;
  }

  getLeaders = (): BanzukeEntry[] => {
    const leaderList = this.banzuke.list.concat().sort( (rikishiA: BanzukeEntry, rikishiB: BanzukeEntry) => {
      const winsA: number = this.getWinTotal(rikishiA);
      const winsB: number = this.getWinTotal(rikishiB);

      return winsB - winsA;
    });

    return leaderList;
  }

  reportResult = (bout: Bout) => {

    // find the banzuke entries
    const entries: BanzukeEntry[] = this.banzuke.list.filter( (entry: BanzukeEntry) => {
      return (entry.name === bout.eastRikishi || entry.name === bout.westRikishi);
    });

    entries.forEach( (entry: BanzukeEntry) => {
      entry.setResult(bout.day - 1, bout.result);
    });
  }
}

export default BanzukeService;
