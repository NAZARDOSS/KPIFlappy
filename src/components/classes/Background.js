import bg from "../../assets/flappy_bird_bg.jpg"

class Background {
    
     constructor() {
        this.image = new Image();
        this.image.src = bg;
    }

    draw(ctx) {
        ctx.drawImage(this.image, 0, 0);
    }
  }
  
  export default Background;
  