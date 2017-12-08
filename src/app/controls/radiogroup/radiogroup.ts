import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-radio-group',
  templateUrl: './radiogroup.html',
  styleUrls: ['./radiogroup.css']
})
class RadioGroupComponent {

  static COLUMNS = 0;
  static ROWS = 1;

  @Output() selectionChanged = new EventEmitter<any>();
  @Input() items: any[];
  @Input() direction: number;

  itemSelected = (item) => {

    this.items.forEach( (i: any) => {
      i.selected = false;
    });

    item.selected = true;

    this.selectionChanged.emit(item);
  }
}

export default RadioGroupComponent;
