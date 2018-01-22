import { Component, Input } from '@angular/core';

import isNil from 'lodash-es/isNil';

import ScheduleService from '../../../services/schedule.service';
import BanzukeService from '../../../services/banzuke.service';
import MatchService from '../../../services/match.service';
import DaySchedule from '../../../model/day_schedule';
import Bout from '../../../model/bout';

@Component({
  selector: 'app-schedule-view',
  templateUrl: './scheduleView.html',
  styleUrls: ['./scheduleView.css']
})
class ScheduleViewComponent {

  @Input() daySchedule: DaySchedule;

  constructor(
    private scheduleService: ScheduleService,
    private matchService: MatchService,
    private banzukeService: BanzukeService) {}

  createBout = (bout: Bout) => {
    this.scheduleService.setBout( this.daySchedule.day, bout );
  }

  deleteBout = (index: number) => {
    this.daySchedule.bouts[index].result = null;
    this.banzukeService.reportResult(this.daySchedule.bouts[index]);

    this.scheduleService.deleteBout( this.daySchedule.day, index );
  }

  autoSchedule = () => {
    this.scheduleService.generateDaySchedule(this.daySchedule.day, this.banzukeService.banzuke);
  }

  playAllRemaining = () => {
    this.daySchedule.bouts.forEach( (bout: Bout) => {
      if (isNil(bout.result)) {
        this.matchService.runMatch(bout, true);
      }
    });
  }
}

export default ScheduleViewComponent;
