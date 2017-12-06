import { Component, Input } from '@angular/core';

import BanzukeEntry from '../../../model/banzukeEntry';

@Component({
  selector: 'app-rank-row',
  templateUrl: './rankRow.html',
  styleUrls: ['./rankRow.css']
})
class RankRowComponent {

  @Input() east: BanzukeEntry;
  @Input() west: BanzukeEntry;

}

export default RankRowComponent;
