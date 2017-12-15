import { Component } from '@angular/core';

import isNil from 'lodash-es/isNil';

import BanzukeEntry from '../../../model/banzukeEntry';
import BanzukeService from '../../../services/banzuke.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.css']
})
class LeaderboardComponent {

  _collapsed = true;
  _bigBoard: any;

  constructor(private banzukeService: BanzukeService) {}

  get collapsed(): boolean { return this._collapsed; }
  get leaderList(): string[] {
    return this.banzukeService.getLeaders().map((entry: BanzukeEntry) => {
      return entry.name;
    }).slice(0, 10);
  }

  get bigBoard(): any {

    return this.buildBigBoard();
  }

  hideShow = () => {
    this._collapsed = !this.collapsed;
  }

  buildBigBoard = () => {
    const list: BanzukeEntry[] = this.banzukeService.getLeaders();

    const bucketList: any[][] = new Array(15);

    list.slice(0, 10).forEach( (entry: BanzukeEntry, index: number) => {
      const losses = this.banzukeService.getLossTotal(entry);

      let winList = bucketList[losses];

      if (winList === undefined) {
        winList = new Array();
      }

      winList.push({ losses, entry });
      bucketList[losses] = winList;
    });

    const finalList = bucketList.filter( (item: any) => {
      return item.length !== 0;
    }).slice(0, 3);

    return finalList;
  }
}

export default LeaderboardComponent;
