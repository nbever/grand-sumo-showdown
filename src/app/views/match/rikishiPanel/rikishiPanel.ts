import { Component, Input, Output, EventEmitter } from '@angular/core';

import {
  AGGRESSIVE,
  NORMAL,
  HENKA,
  DEFENSIVE
} from '../../../constants/styleConstants';

@Component({
  selector: 'app-rikishi-panel',
  templateUrl: './rikishiPanel.html',
  styleUrls: ['./rikishiPanel.css']
})
class RikishiPanelComponent {

  @Output() styleSelected = new EventEmitter<any>();
  @Input() rikishiName: string;
  @Input() columns: number[];

  _choices = [
    { label: 'Aggressive', value: AGGRESSIVE, selected: false, disabled: false },
    { label: 'Normal', value: NORMAL, selected: true, disabled: false },
    { label: 'Defensive', value: DEFENSIVE, selected: false, disabled: false },
    { label: 'Henka', value: HENKA, selected: false, disabled: false },
  ];

  get choices() {

    if ( this.columns.length < 2 ) {
      this._choices[3].disabled = true;
    }

    return this._choices;
  }

  itemSelected = (item) => {
    this.styleSelected.emit(item);
  }
}

export default RikishiPanelComponent;
