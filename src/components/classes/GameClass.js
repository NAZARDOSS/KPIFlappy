import Background from './Background';
import Bird from './Bird';
import Foreground from './Foreground';
import GameOver from './GameOver';
import Heart from './Heart';
import Pipe from './Pipe';

class GameClass {
  constructor() {
    this.background = new Background();
    this.bird = new Bird();
    this.foreground = new Foreground();
    this.gameOver = new GameOver();
    this.heart = new Heart();
    this.pipe = new Pipe(0, 0);
  }
}

export default GameClass;
