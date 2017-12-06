import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import ScheduleService from './schedule.service';

import BanzukeEntry from '../model/banzukeEntry';
import Bout from '../model/Bout';

@Injectable()
class BanzukeSelectionService {

  constructor(
    private scheduleService: ScheduleService ) {}

  private rikishiSelected = new Subject<BanzukeEntry>();
  rikishiAnnouncement$ = this.rikishiSelected.asObservable();

  _bouts: Bout[] = [];

  get bouts() {
    return this._bouts;
  }

  selectRikishi( rikishi: BanzukeEntry ) {
    this._bouts = this.scheduleService.getRikishiBouts(rikishi.name);
    this.rikishiSelected.next(rikishi);
  }
}

export default BanzukeSelectionService;
