class Roll {

  _20sided: number;
  _6column: number;
  _6sided: number;
  _12sided: number;

  get d20(): number { return this._20sided; }
  get d12(): number { return this._12sided; }
  get column(): number { return this._6column; }

  roll() {
    this._20sided = Math.floor((Math.random() * 20) + 1);
    this._6column = Math.floor((Math.random() * 6) + 1);
    this._6sided = Math.floor((Math.random() * 6) + 1);
    this._12sided = Math.floor((Math.random() * 11) + 2);
  }
}

export default Roll;
