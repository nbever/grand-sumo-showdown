import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import Bout from '../model/bout';

@Injectable()
class MatchService {

  private runMatchRequested = new Subject<any>();
  matchRunRequested$ = this.runMatchRequested.asObservable();

  runMatch = (bout: Bout, auto: boolean = false): void => {
    this.runMatchRequested.next({ bout, auto });
  }
}

export default MatchService;
