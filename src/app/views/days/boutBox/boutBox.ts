import { Component, Input } from '@angular/core';

import isNil from 'lodash-es/isNil';
import Bout from '../../../model/bout';

@Component({
  selector: 'app-bout-box',
  templateUrl: './boutBox.html',
  styleUrls: ['./boutBox.css']
})
class BoutBoxComponent {

  @Input() bout: Bout;

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
}

export default BoutBoxComponent;
