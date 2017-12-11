import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import isNil from 'lodash-es/isNil';
import flattenDeep from 'lodash-es/flattenDeep';
import unionBy from 'lodash-es/unionBy';

import BanzukeService from '../../../services/banzuke.service';
import ScheduleService from '../../../services/schedule.service';
import BanzukeSelectionService from '../../../services/banzukeSelectionService';
import DaySchedule from '../../../model/day_schedule';
import Bout from '../../../model/bout';
import BanzukeEntry from '../../../model/banzukeEntry';
import Injury from '../../../model/Injury';

@Component({
  selector: 'app-bout-creator',
  templateUrl: './boutCreator.html',
  styleUrls: ['./boutCreator.css']
})
class BoutCreatorComponent implements OnChanges {

  @Output() addBout = new EventEmitter<Bout>();
  @Input() daySchedule: DaySchedule;

  _eastItem: BanzukeEntry;
  _westItem: BanzukeEntry;
  _eastBlacklist: BanzukeEntry[] = [];
  _westBlacklist: BanzukeEntry[] = [];

  constructor(
    private banzukeService: BanzukeService,
    private scheduleService: ScheduleService,
    private banzukeSelectionService: BanzukeSelectionService ) {

    scheduleService.scheduleAnnouncement$.subscribe(this.resetBlackLists);
  }

  get items() {
    return this.banzukeService.banzuke.list;
  }

  get eastItem(): BanzukeEntry { return this._eastItem; }
  get westItem(): BanzukeEntry { return this._westItem; }

  get eastBlacklist(): BanzukeEntry[] {
    return this._eastBlacklist;
  }

  set eastBlacklist( list: BanzukeEntry[] ) {
    this._eastBlacklist = list;
  }

  get westBlacklist(): BanzukeEntry[] {
    return this._westBlacklist;
  }

  set westBlacklist( list: BanzukeEntry[] ) {
    this._westBlacklist = list;
  }

  ngOnChanges(): void {
    this.resetBlackLists();
  }

  resetBlackLists = () => {
    const blacklist = this.getListOfRikishiScheduled();
    this.eastBlacklist = blacklist;
    this.westBlacklist = blacklist;
  }

  eastSelected = (item: BanzukeEntry) => {
    this._eastItem = item;

    const blackList: BanzukeEntry[] = this.getOpponents(item);
    blackList.push( item );
    this.westBlacklist = blackList;

    this.banzukeSelectionService.selectRikishi(item);
  }

  westSelected = (item: BanzukeEntry) => {
    this._westItem = item;

    const blackList: BanzukeEntry[] = this.getOpponents(item);
    blackList.push( item );
    this.eastBlacklist = blackList;

    this.banzukeSelectionService.selectRikishi(item);
  }

  createBout = () => {

    if ( isNil(this.eastItem) || isNil(this.westItem) ) {
      return;
    }

    const bout = new Bout( this.eastItem.name, this.westItem.name );
    bout.day = this.daySchedule.day;
    this.addBout.emit(bout);
    this._eastItem = null;
    this._westItem = null;
  }

  getListOfRikishiScheduled = (): BanzukeEntry[] => {

    const rikishiScheduledToday: any = flattenDeep(this.daySchedule.bouts.map( (bout: Bout) => {
      return [bout.eastRikishi, bout.westRikishi];
    }));

    const eliminatedRikishi = this.daySchedule.injuredRikishi.filter( (rikishi: Injury) => {
      return !rikishi.canSchedule;
    }).map( (injury: Injury) => {
      return injury.rikishi;
    });

    rikishiScheduledToday.push(eliminatedRikishi);

    return this.mapStringToBanzukeEntry(rikishiScheduledToday);
  }

  getOpponents = (rikishi: BanzukeEntry): BanzukeEntry[] => {

    const bouts: Bout[] = this.scheduleService.getRikishiBouts(rikishi.name);

    const opponentNames: String[] = bouts.map( (bout: Bout) => {
      if ( bout.eastRikishi === rikishi.name) {
        return bout.westRikishi;
      }

      return bout.eastRikishi;
    });

    const rikishiScheduledToday: BanzukeEntry[] = this.getListOfRikishiScheduled();
    const opponentEntries: BanzukeEntry[] = this.mapStringToBanzukeEntry(opponentNames);

    const entries: BanzukeEntry[] = unionBy(
      rikishiScheduledToday,
      opponentEntries,
      (entry) => entry.name );

    return entries;
  }

  mapStringToBanzukeEntry = (names: String[]): BanzukeEntry[] => {

    const entries: BanzukeEntry[] = this.items.filter( (entry: BanzukeEntry) => {
      const index: number = names.findIndex( (opp: String) => {
        return opp === entry.name;
      });

      return index !== -1;
    });

    return entries;
  }
}


export default BoutCreatorComponent;
