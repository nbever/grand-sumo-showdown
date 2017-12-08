import { Component, Input } from '@angular/core';

import isNil from 'lodash-es/isNil';
import last from 'lodash-es/last';

import MatchService from '../../services/match.service';
import Bout from '../../model/bout';
import RollResult from '../../model/rollResult';
import RIKISHI_CARDS from '../../data/rikishi_cards';

import {
  WEST_LOSES_1_REROLL,
  EAST_LOSES_1_REROLL
} from '../../constants/resultConstants';

import { runFullMatch, runPreMatch } from '../../utils/matchRunner';

@Component({
  selector: 'app-match-dialog',
  templateUrl: './matchView.html',
  styleUrls: ['./matchView.css']
})
class MatchViewComponent {

  _show = false;
  _bout: Bout;
  _westColumns: number[];
  _eastColumns: number[];
  _westStyle = 1;
  _eastStyle = 1;
  _rollResults: RollResult[] = [];

  // choices = [
  //   { label: 'Aggressive', value: MatchViewComponent.AGGRESSIVE, selected: false },
  //   { label: 'Normal', value: MatchViewComponent.NORMAL, selected: true },
  //   { label: 'Defensive', value: MatchViewComponent.DEFENSIVE, selected: false },
  //   { label: 'Henka', value: MatchViewComponent.HENKA, selected: false },
  // ];

  constructor( private matchService: MatchService ) {
    matchService.matchRunRequested$.subscribe(this.prepareMatch);
  }

  get bout() { return this._bout; }

  get showMatch() {
    return this._show;
  }

  set showMatch(shouldI: boolean) {
    this._show = shouldI;
  }

  get westColumns() {
    return this._westColumns;
  }

  get eastColumns() {
    return this._eastColumns;
  }

  get westStyle() {
    return this._westStyle;
  }

  get eastStyle() {
    return this._eastStyle;
  }

  get rollResults() {
    return this._rollResults;
  }

  westStyleSet = (style) => {
    this._westStyle = style.value;
    this.calculateColumns();
  }

  eastStyleSet = (style) => {
    this._eastStyle = style.value;
    this.calculateColumns();
  }

  prepareMatch = (bout: Bout) => {
    this.showMatch = true;
    this._bout = bout;
    this._rollResults = [];
    this.calculateColumns();
  }

  runMatch = () => {

    const results = runPreMatch(
      this.bout,
      this.eastColumns.length,
      this.eastStyle,
      this.westColumns.length,
      this.westStyle
    );

    if (!isNil(results)) {
      this.interpretPreMatchResults(results);
    }

    if (this.checkForEnd() === true) {
      return;
    }

    // run the rest!
    let matchResults;
    let breakLoop = false;

    do {
      matchResults = runFullMatch(
        this.bout,
        this.eastColumns.length,
        this.eastStyle,
        this.westColumns.length,
        this.westStyle
      );

      const lastResult = matchResults[matchResults.length - 1].result;

      if ( !isNil(lastResult) && lastResult.toLowerCase().indexOf('reroll') !== -1) {
        if (lastResult === WEST_LOSES_1_REROLL) {
          this._westColumns.splice(0, 1);
          this._eastColumns.push(0);
        } else if (lastResult === EAST_LOSES_1_REROLL) {
          this._eastColumns.splice(0, 1);
          this._westColumns.push(0);
        }
      } else {
        breakLoop = true;
      }

      matchResults.forEach( (matchResult: RollResult) => {
        this._rollResults.push(matchResult);
      });

    } while ( breakLoop === false );
  }

  checkForEnd = () => {
    // means the bout is over.
    const lastResult: RollResult = <RollResult>last(this._rollResults);
    if ( !isNil(lastResult) && !isNil( lastResult.boutResult) ) {
      this.bout.result = lastResult.boutResult;
      return true;
    }

    return false;
  }

  interpretPreMatchResults = (results) => {
    this._eastColumns = Array(this.normalizeColumnCount(results.eastColumns - 3)).fill(0);
    this._westColumns = Array(this.normalizeColumnCount(results.westColumns - 3)).fill(0);

    (<RollResult[]>results.results).forEach( (result: RollResult) => {
      this._rollResults.push(result);
    });
  }

  calculateColumns = () => {
    const eastLetter = RIKISHI_CARDS[<string>this.bout.eastRikishi].Rating;
    const westLetter = RIKISHI_CARDS[<string>this.bout.westRikishi].Rating;

    let diff = eastLetter.charCodeAt(0) - westLetter.charCodeAt(0);

    if (this.westStyle === 0) {
      diff = diff - 1;
    }

    if (this.eastStyle === 0) {
      diff = diff + 1;
    }

    this._eastColumns = Array(this.normalizeColumnCount(diff)).fill(0);
    this._westColumns = Array(this.normalizeColumnCount(-1 * diff)).fill(0);
  }

  normalizeColumnCount(diff: number): number {
    const orig = 3 + diff;

    if (orig < 0) {
      return 0;
    }

    if (orig > 6) {
      return 6;
    }

    return orig;
  }

  cancel = () => {
    this.showMatch = false;
  }

}

export default MatchViewComponent;
