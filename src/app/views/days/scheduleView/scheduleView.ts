import { Component, Input } from '@angular/core';

import ScheduleService from '../../../services/schedule.service';
import DaySchedule from '../../../model/day_schedule';
import Bout from '../../../model/bout';

@Component({
  selector: 'app-schedule-view',
  templateUrl: './scheduleView.html',
  styleUrls: ['./scheduleView.css']
})
class ScheduleViewComponent {

  @Input() daySchedule: DaySchedule;

  constructor(private scheduleService: ScheduleService) {}

  createBout = (bout: Bout) => {
    this.scheduleService.setBout( this.daySchedule.day, bout );
  }
}

export default ScheduleViewComponent;
