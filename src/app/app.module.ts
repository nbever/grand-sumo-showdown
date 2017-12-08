import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import BanzukeService from './services/banzuke.service';
import ScheduleService from './services/schedule.service';
import BanzukeSelectionService from './services/banzukeSelectionService';
import MatchService from './services/match.service';

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

import MatchViewComponent from './views/match/matchView';
import RikishiPanelComponent from './views/match/rikishiPanel';

import DropdownComponent from './controls/dropdown';
import RadioGroupComponent from './controls/radiogroup';
import RadioButtonComponent from './controls/radiogroup/radiobutton';

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
    RadioButtonComponent,
    RadioGroupComponent,
    BoutCreatorComponent,
    BoutBoxComponent,
    MatchViewComponent,
    RikishiPanelComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    BanzukeService,
    ScheduleService,
    BanzukeSelectionService,
    MatchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
