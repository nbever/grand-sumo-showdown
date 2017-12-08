import Roll from './roll';
import Result from './result';

class RollResult {

  _roll: Roll;
  _result: string;
  _boutResult: Result;

  constructor(aRoll: Roll, aResult: string, aBoutResult?: Result) {
    this.roll = aRoll;
    this.result = aResult;
    this.boutResult = aBoutResult;
  }

  set roll(aRoll: Roll) {
    this._roll = aRoll;
  }

  get roll(): Roll {
    return this._roll;
  }

  get result(): string {
    return this._result;
  }

  set result(aResult: string) {
    this._result = aResult;
  }

  get boutResult(): Result {
    return this._boutResult;
  }

  set boutResult(aResult: Result) {
    this._boutResult = aResult;
  }

  toString(): string {
    return `column: ${this.roll.column} d20: ${this.roll.d20} d12: ${this.roll.d12}: ${this.result}`;
  }
}

export default RollResult;
