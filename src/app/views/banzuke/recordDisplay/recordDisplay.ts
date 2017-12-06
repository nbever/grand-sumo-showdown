import { Component, Input } from '@angular/core';

import Result from '../../../model/result';

@Component({
  selector: 'app-record-display',
  templateUrl: './recordDisplay.html',
  styleUrls: ['./recordDisplay.css']
})
class RecordDisplayComponent {

  @Input() results: Result[];
  @Input() name: string;
}

export default RecordDisplayComponent;
