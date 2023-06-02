import heart from '../../assets/heart.png';

class Heart {
  constructor() {
      this.image = new Image();
      this.image.src = heart;
  }

  draw(ctx, livesCount) {
      for (let i = 0; i < livesCount; i++) {
          ctx.drawImage(this.image, i * 30, 20);
      }
  }
}
export default Heart
