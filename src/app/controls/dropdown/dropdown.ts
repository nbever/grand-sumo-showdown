import { Component, Input, Output, EventEmitter } from '@angular/core';

import isNil from 'lodash-es/isNil';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.html',
  styleUrls: ['./dropdown.css']
})
class DropdownComponent<T> {

  @Input() items: T[];
  @Input() blacklist: T[] = [];
  @Input() selectedItem: T;

  @Output() itemSelected = new EventEmitter<T>();

  _selectedItem: T;
  _open = false;

  get open() { return this._open; }
  set open( isOpen: boolean ) { this._open = isOpen; }

  get filteredItems() {
    const filteredItems = this.items.filter( (item: any) => {
      return item !== this.itemSelected;
    });

    return filteredItems;
  }

  drawerClicked = () => {
    this.open = !this.open;
  }

  itemClicked = (item: T) => {
    this.selectedItem = item;
    this.open = false;
    this.itemSelected.emit(item);
  }

  shouldCollapse = (item: T) => {

    if ( item === this.selectedItem ) {
      return true;
    }

    if ( isNil(this.blacklist) ) {
      return false;
    }

    const badItem = this.blacklist.find( (blackItem: T) => {
      return item === blackItem;
    });

    return !isNil(badItem);
  }
}

export default DropdownComponent;
