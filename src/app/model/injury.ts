class Injury {

  _rikishi: string;
  _canSchedule: boolean;

  constructor( aRikishi: string, andCanSchedule: boolean ) {
    this._rikishi = aRikishi;
    this._canSchedule = andCanSchedule;
  }

  get rikishi(): string { return this._rikishi; }
  get canSchedule(): boolean { return this._canSchedule; }
}

export default Injury;
