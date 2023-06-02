import gameOver from '../../assets/game-over.png';

class GameOver {
  constructor() {
      this.image = new Image();
      this.image.src = gameOver;
  }

  draw(ctx) {
      ctx.drawImage(this.image, 140, 170);
  }
}

export default GameOver;
