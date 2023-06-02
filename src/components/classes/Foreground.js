import fg from '../../assets/flappy_bird_fg.png';

class Foreground {
  constructor() {
    this.image = new Image();
    this.image.src = fg;
    this.width = 500; 
    this.height = 0;

    this.image.onload = () => {
      this.height = this.image.height; // Обновляем высоту после загрузки изображения
    };
  }

  draw(ctx, cvs) {
    if (this.height > 0) {
      ctx.drawImage(this.image, 0, cvs.height - this.height, this.width, this.height);
    }
  }
}

export default Foreground;
