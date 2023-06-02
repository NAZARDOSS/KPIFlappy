import Bird from './classes/Bird';
import Background from './classes/Background';
import Foreground from './classes/Foreground';
import Pipe from './classes/Pipe';
import Heart from './classes/Heart';
import GameOver from './classes/GameOver';

function Game(canvas, ctx, speed, updateScore) {
  const game = {
    canvas,
    ctx,
    speed: 2,
    autoMode: false,
    bird: new Bird(),
    background: new Background(),
    foreground: new Foreground(),
    heart: new Heart(),
    gameOver: new GameOver(),
    pipes: [new Pipe(canvas.width, 0, speed)],
    score: 0,
    livesCount: 3,
    revel: false,
    revelTime: 2000,
  };

  game.birdNav = (e) => {
  e = e || window.event;
  if (e.keyCode == '38') {
    game.bird.moveUp();
    game.bird.isMoving = true;
    setTimeout(() => {
      game.bird.isMoving = false;
    }, 2);
  }
  if (e.keyCode == '40') {
    game.bird.moveDown();
    game.bird.isMoving = true;
    setTimeout(() => {
      game.bird.isMoving = false;
    }, 2);
  }
  if (e.keyCode == '65') { 
    game.toggleAutoMode();
  }
};


  game.toggleAutoMode = () => {
    game.autoMode = !game.autoMode;
  };

  game.autoModeLogic = () => {
    if (game.autoMode) {
      let closestPipe = game.pipes.reduce((closest, pipe) => {
        if (pipe.x >= -80 && (pipe.x + pipe.pipeUp.width) > game.bird.xPos && pipe.x < closest.x) {
          return pipe;
        } else {
          return closest;
        }
      }, game.pipes[0]);

      let pipeCenter = (closestPipe.y + closestPipe.pipeUp.height + closestPipe.gap / 2)+10;

      if (game.bird.yPos + game.bird.height / 2 > pipeCenter && !game.bird.isMoving) {
        game.bird.moveUp();
        game.bird.isMoving = true;
        setTimeout(() => {
          game.bird.isMoving = false;
        }, 50);
      } else if (game.bird.yPos + game.bird.height / 2 < closestPipe.y + closestPipe.pipeUp.height && !game.bird.isMoving) {
        game.bird.moveDown();
        game.bird.isMoving = true;
        setTimeout(() => {
          game.bird.isMoving = false;
        }, 100);
      }
    }
  };

  game.hardMod = () => {
    switch (game.score) {
      case 5:
        game.speed = 3;
        game.revelTime = 1000;
        break;
      case 15:
        game.speed = 4;
        game.revelTime = 800;
      default:
        break;
    }
  };

  game.birdRevel = () => {
    if (!game.revel) {
      game.revel = true;
      game.livesCount--;
      if (game.livesCount === 0) {
        updateScore(game.score);
        game.gameOver.draw(game.ctx);
      }
      setTimeout(() => {
        game.revel = false;
      }, game.revelTime);
    }
  };

  game.drawScore = () => {
    game.ctx.font = "25px serif";
    game.ctx.fillStyle = "yellow";
    game.ctx.fillText(game.score, game.canvas.width - 55, 52);
  };

  game.draw = function () {
    game.background.draw(game.ctx);
    let render = false;
    let pipesToRemove = [];

    for (let i = 0; i < game.pipes.length; i++) {
      if (game.bird.yPos + game.bird.height >= game.canvas.height - game.foreground.height) {
        game.bird.yPos = 0; // перемещение птицы вверх
      }
      game.pipes[i].draw(game.ctx);
      game.pipes[i].move(game.speed);

      if (!render && i === game.pipes.length - 1 && (game.pipes[i].x === 123 || game.pipes[i].x === 124 || game.pipes[i].x === 125 || game.pipes[i].x === 126)) {
        console.log("RENDER");
        if (!render) {
          game.pipes.push(new Pipe(this.canvas.width + 80, Math.floor(Math.random() * this.pipes[i].pipeUp.height) - this.pipes[i].pipeUp.height));
          render = true;
        }
        break;
      } else if (game.pipes[i].x === -80 || game.pipes[i].x === -79 || game.pipes[i].x === -78 || game.pipes[i].x === -81) {
        pipesToRemove.push(game.pipes[i]);
        console.log("deleted");
      }

      if (
        game.bird.xPos + game.bird.width >= game.pipes[i].x &&
        game.bird.xPos <= game.pipes[i].x + game.pipes[i].pipeUp.width &&
        (game.bird.yPos <= game.pipes[i].y + game.pipes[i].pipeUp.height ||
          game.bird.yPos + game.bird.height >= game.pipes[i].y + game.pipes[i].pipeUp.height + game.pipes[i].gap)   //||game.bird.yPos + game.bird.height >= game.canvas.height - game.foreground.height
      ) {
        game.birdRevel();
      }
      // console.log("pos", game.pipes[i].x + game.pipes[i].pipeUp.width)
      // console.log(this.score)
      if (game.score >= 5) {
        if ((11 === game.pipes[i].x + game.pipes[i].pipeUp.width) || (12 === game.pipes[i].x + game.pipes[i].pipeUp.width)) {
          game.score++;
          console.log("UPDATE:SCORE", game.score);
          game.hardMod();
        }
      }

      if (game.bird.xPos === game.pipes[i].x + game.pipes[i].pipeUp.width) {
        game.score++;
        console.log("UPDATE:SCORE", game.score);
        game.hardMod();
      }
    }

    for (let pipe of pipesToRemove) {
      game.pipes = game.pipes.filter((p) => p !== pipe);
    }

    game.autoModeLogic();
    game.bird.draw(game.ctx);
    game.foreground.draw(game.ctx, game.canvas);
    game.bird.yPos += 1.5;

    game.heart.draw(game.ctx, game.livesCount);
    game.drawScore();

    if (game.livesCount > 0) {
      requestAnimationFrame(() => game.draw());
    }
    //код забезпечує цикл анімації гри, який продовжується, доки кількість життів більше за 0. Кожного разу, коли виконується анімаційний фрейм, викликається функція game.draw(), що дає можливість оновлювати та відображати графічний стан гри у кожному кадрі.
  };

  game.start = () => {
    document.addEventListener('keydown', (e) => game.birdNav(e));
    game.draw();
  };

  return game;
}

export default Game;
