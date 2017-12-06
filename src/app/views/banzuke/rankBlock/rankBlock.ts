import { Component, Input } from '@angular/core';

import isNil from 'lodash-es/isNil';
import BanzukeEntry from '../../../model/banzukeEntry';
import Rank from '../../../model/rank';

@Component({
  selector: 'app-rank-block',
  templateUrl: './rankBlock.html',
  styleUrls: ['./rankBlock.css']
})
class RankBlockComponent {

  @Input() entries: BanzukeEntry[];
  @Input() rank: Rank;

  _rows;

  get rows() {

    if ( isNil(this._rows)) {
      this._rows = [];

      for ( let i = 0; i < this.entries.length; i += 2 ) {
        const east = this.entries[i];
        const west = ((i + 1) < this.entries.length) ? this.entries[i + 1] : null;

        this._rows.push({ east: east, west: west });
      }
    }

    return this._rows;
  }
}

export default RankBlockComponent;
