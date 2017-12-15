import { Component } from '@angular/core';

import BanzukeEntry from '../../../model/banzukeEntry';
import BanzukeService from '../../../services/banzuke.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.css']
})
class LeaderboardComponent {

  _collapsed = true;

  constructor(private banzukeService: BanzukeService) {}

  get collapsed(): boolean { return this._collapsed; }
  get leaderList(): string[] {
    return this.banzukeService.getLeaders().map((entry: BanzukeEntry) => {
      return entry.name;
    }).slice(0, 10);
  }

  hideShow = () => {
    this._collapsed = !this.collapsed;
  }

  getBigBoard = () => {
    const list: BanzukeEntry[] = this.banzukeService.getLeaders();

    const bucketList: any[][] = new Array(15);

    list.slice(0, 10).forEach( (entry: BanzukeEntry, index: number) => {
      const wins = this.banzukeService.getWinTotal(entry);

      let winList = bucketList[wins];

      if (winList === undefined) {
        winList = new Array();
      }

      winList.push({ wins, entry });
      bucketList[wins] = winList;
    });

    const finalList = bucketList.filter( (item: any) => {
      return item.length !== 0;
    }).slice(0, 3);

    return finalList;
  }
}

export default LeaderboardComponent;
