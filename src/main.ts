import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import BanzukeEntry from './app/model/banzukeEntry';
import Rank from './app/model/rank';
import SIDE from './app/model/side';
import RIKISHI_CARDS from './app/data/rikishi_cards';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
