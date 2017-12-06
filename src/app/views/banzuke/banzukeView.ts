import { Component, OnInit } from '@angular/core';

import isNil from 'lodash-es/isNil';
import BanzukeEntry from '../../model/banzukeEntry';
import BanzukeService from '../../services/banzuke.service';
import BanzukeSelectionService from '../../services/banzukeSelectionService';
import Rank from '../../model/rank';

@Component({
  selector: 'app-banzuke-view',
  templateUrl: './banzukeView.html',
  styleUrls: ['./banzukeView.css']
  // providers: [BanzukeSelectionService]
})
class BanzukeViewComponent implements OnInit {

  _ranks: Rank[] = [];
  _hidden = false;

  constructor(
    private banzukeService: BanzukeService,
    private banzukeSelectionService: BanzukeSelectionService ) {

    banzukeSelectionService.rikishiAnnouncement$.subscribe( this.rikishiSelected );
  }

  get banzuke() {
    return this.banzukeService.banzuke;
  }

  get hidden(): boolean {
    return this._hidden;
  }

  set hidden(hideMe: boolean) {
    this._hidden = hideMe;
  }

  get ranks() {

    if ( isNil(this._ranks) || this._ranks.length === 0 ) {
      Object.keys(Rank).forEach( (rank: Rank) => {
        this._ranks.push(rank);
      });
    }

    return this._ranks;
  }

  ngOnInit() {

  }

  rikishiSelected = (entry: BanzukeEntry) => {

  }
}

export default BanzukeViewComponent;
