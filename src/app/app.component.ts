import { Component } from '@angular/core';

import BanzukeService from './services/banzuke.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
class AppComponent {

  title: String = 'app';

  constructor( private banzukeService: BanzukeService ) {}
}

export default AppComponent;
