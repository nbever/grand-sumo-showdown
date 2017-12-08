import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import Bout from '../model/bout';

@Injectable()
class MatchService {

  private runMatchRequested = new Subject<Bout>();
  matchRunRequested$ = this.runMatchRequested.asObservable();

  runMatch = (bout: Bout): void => {
    this.runMatchRequested.next(bout);
  }
}

export default MatchService;
