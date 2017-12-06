import Schedule from './schedule';
import Banzuke from './banzuke';

class Basho {
  _schedule: Schedule;
  _banzuke: Banzuke;

  get schedule(): Schedule {
    return this._schedule;
  }

  get banzuke(): Banzuke {
    return this._banzuke;
  }
}

export default Basho;
