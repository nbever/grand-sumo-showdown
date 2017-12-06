import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import BanzukeService from './services/banzuke.service';
import ScheduleService from './services/schedule.service';
import BanzukeSelectionService from './services/banzukeSelectionService';

import AppComponent from './app.component';
import BanzukeViewComponent from './views/banzuke/banzukeView';
import RankRowComponent from './views/banzuke/rankRow';
import RankBlockComponent from './views/banzuke/rankBlock';
import RikishiBlock from './views/banzuke/rikishiBlock';
import RecordDisplayComponent from './views/banzuke/recordDisplay/recordDisplay';

import DayViewComponent from './views/days/dayView';
import DaySelectorComponent from './views/days/daySelector';
import ScheduleViewComponent from './views/days/scheduleView';
import BoutCreatorComponent from './views/days/boutCreator';
import BoutBoxComponent from './views/days/boutBox';

import DropdownComponent from './controls/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    BanzukeViewComponent,
    RankRowComponent,
    RankBlockComponent,
    RikishiBlock,
    RecordDisplayComponent,
    DayViewComponent,
    DaySelectorComponent,
    ScheduleViewComponent,
    DropdownComponent,
    BoutCreatorComponent,
    BoutBoxComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    BanzukeService,
    ScheduleService,
    BanzukeSelectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
