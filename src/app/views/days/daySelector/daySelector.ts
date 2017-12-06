import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-day-selector',
  templateUrl: './daySelector.html',
  styleUrls: ['./daySelector.css']
})
class DaySelectorComponent {

  @Output() showDay = new EventEmitter<number>();

  _selectedDay = -1;

  _days = [
    {number: 1, text: '&#19968;'},
    {number: 2, text: '&#20108;'},
    {number: 3, text: '&#19977;'},
    {number: 4, text: '&#22235;'},
    {number: 5, text: '&#20116;'},
    {number: 6, text: '&#20845;'},
    {number: 7, text: '&#19971;'},
    {number: 8, text: '&#20843;'},
    {number: 9, text: '&#20061;'},
    {number: 10, text: '&#21313;'},
    {number: 11, text: '&#21313;&#19968;'},
    {number: 12, text: '&#21313;&#20108;'},
    {number: 13, text: '&#21313;&#19977;'},
    {number: 14, text: '&#21313;&#22235;'},
    {number: 15, text: '&#21313;&#20116;'}
  ];

  get days(){ return this._days; }

  get selectedDay() { return this._selectedDay; }

  daySelected = (day: any) => {
    this._selectedDay = day;
    this.showDay.emit(day.number);
  }
}

export default DaySelectorComponent;
