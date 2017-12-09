import { Component, Input, Output, EventEmitter } from '@angular/core';

import isNil from 'lodash-es/isNil';
import BanzukeSelectionService from '../../../services/banzukeSelectionService';
import BanzukeEntry from '../../../model/banzukeEntry';
import Result from '../../../model/Result';
import Bout from '../../../model/Bout';

@Component({
  selector: 'app-rikishi-block',
  templateUrl: './rikishiBlock.html',
  styleUrls: ['./rikishiBlock.css']
})
class RikishiBlockComponent {

  @Input() entry: BanzukeEntry;

  _state = {
    selected: false,
    winner: false,
    loser: false,
    scheduled: false,
    day: -1
  };

  constructor( private banzukeSelectionService: BanzukeSelectionService ) {
    banzukeSelectionService.rikishiAnnouncement$.subscribe( this.rikishiSelected );
  }

  get state() {
    return this._state;
  }

  rikishiClicked = ($event) => {
    this.banzukeSelectionService.selectRikishi(this.entry);
  }

  rikishiSelected = (newSelection: BanzukeEntry) => {

    if ( isNil(this.entry) || isNil(this.entry.name) ) {
      return;
    }

    this.state.selected = false;
    this.state.winner = false;
    this.state.loser = false;
    this.state.scheduled = false;

    if ( newSelection.name === this.entry.name ) {
      this.state.selected = true;
      return;
    }

    this.setMatchStatus( newSelection );
  }

  setMatchStatus = (newSelection: BanzukeEntry) => {

    const bout: Bout = this.banzukeSelectionService.bouts.find( (b: Bout) => {
      return ((b.eastRikishi === newSelection.name ||
        b.westRikishi === newSelection.name) &&
        (this.entry.name === b.eastRikishi ||
         this.entry.name === b.westRikishi));
    });

    if (isNil(bout)) {
      return;
    }

    this.state.scheduled = true;
    this.state.day = bout.day;

    if (isNil(bout.result)) {
      return;
    }

    this.state.loser = bout.result.winner === this.entry.name;
    this.state.winner = bout.result.loser === this.entry.name;
  }
}

export default RikishiBlockComponent;
