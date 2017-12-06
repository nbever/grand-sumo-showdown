import { Component } from '@angular/core';

import DaySchedule from '../../model/day_schedule';
import ScheduleService from '../../services/schedule.service';

@Component({
  selector: 'app-day-view',
  templateUrl: './dayView.html',
  styleUrls: ['./dayView.css']
})
class DayViewComponent {

  _daySchedule: DaySchedule;

  constructor( private scheduleService: ScheduleService ) {}

  get daySchedule() { return this._daySchedule; }

  daySelected = (day: number) => {
    this._daySchedule = this.scheduleService.getDaySchedule(day);
  }
}

export default DayViewComponent;
