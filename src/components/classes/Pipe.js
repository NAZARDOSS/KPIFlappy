import pipeUp from '../../assets/flappy_bird_pipeUp.png'
import pipeBottom from '../../assets/flappy_bird_pipeBottom.png'

class Pipe {
  constructor(x, y) {
    this.pipeUp = new Image();
    this.pipeBottom = new Image();
    this.pipeUp.src = pipeUp;
    this.pipeBottom.src = pipeBottom;
    this.x = x;
    this.y = y;
    this.gap = 80;
  }
  
  move(speed) {
    this.x -= speed;
  }

  draw(ctx) {
    ctx.drawImage(this.pipeUp, this.x, this.y);
    ctx.drawImage(this.pipeBottom, this.x, this.y + this.pipeUp.height + this.gap);
  }
}

export default Pipe;
