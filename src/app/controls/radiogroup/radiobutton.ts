import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radiobutton.html',
  styleUrls: ['./radiobutton.css']
})
class RadioButtonComponent {

  @Output() itemSelected = new EventEmitter<any>();
  @Input() item: any;
  @Input() disabled: boolean;

  itemClicked = () => {
    if ( this.disabled === true ) {
      return;
    }

    this.itemSelected.emit(this.item);
  }
}

export default RadioButtonComponent;
