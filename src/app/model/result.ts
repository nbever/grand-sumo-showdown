import KIMARITE from './kimarite';

class Result {

  _kimarite: KIMARITE;
  _winner: string;
  _loser: string;

  constructor(aWinner?: string, aLoser?: string, aKimarite?: KIMARITE) {
    this._kimarite = aKimarite;
    this._winner = aWinner;
    this._loser = aLoser;
  }

  get winner(){ return this._winner; }

  get loser(){ return this._loser; }

  get kimarite(){ return this._kimarite; }
}

export default Result;
