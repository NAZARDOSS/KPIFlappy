import bird from '../../assets/flappy_bird_bird.png'

class Bird {
    constructor() {
      this.image = new Image();
      this.image.src = bird;
      this.xPos = 10;
      this.yPos = 150;
      this.height = this.image.height;
      this.width = this.image.width;
  }

  moveUp() {
      this.yPos -= 35;
      if (this.sounds) this.flySound.play();
  }

  moveDown() {
      this.yPos += 15;
  }

  draw(ctx) {
      ctx.drawImage(this.image, this.xPos, this.yPos);
  }
}

export default Bird;