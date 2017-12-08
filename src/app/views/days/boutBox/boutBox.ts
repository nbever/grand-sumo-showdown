import { Component, Input, Output, EventEmitter } from '@angular/core';

import isNil from 'lodash-es/isNil';
import Bout from '../../../model/bout';
import MatchService from '../../../services/match.service';

@Component({
  selector: 'app-bout-box',
  templateUrl: './boutBox.html',
  styleUrls: ['./boutBox.css']
})
class BoutBoxComponent {

  @Output() deleteBout = new EventEmitter<number>();
  @Input() bout: Bout;

  constructor(private matchService: MatchService) {}

  get eastWinner() {
    if (isNil(this.bout.result)) {
      return false;
    }

    return (this.bout.result.winner === this.bout.eastRikishi);
  }

  get westWinner() {
    if (isNil(this.bout.result)) {
      return false;
    }

    return (this.bout.result.winner === this.bout.westRikishi);
  }

  deleteMe = () => {
    this.deleteBout.emit();
  }

  swapSides = () => {
    this.bout.swap();
  }

  runMatch = () => {
    this.matchService.runMatch(this.bout);
  }
}

export default BoutBoxComponent;
