import Bird from './classes/Bird';
import Background from './classes/Background';
import Foreground from './classes/Foreground';
import Pipe from './classes/Pipe';
import Heart from './classes/Heart';
import GameOver from './classes/GameOver';
import GameClass from './classes/GameClass';

function Game(canvas, ctx, speed, updateScore) {
  const game = {
    canvas,
    ctx,
    speed: 3,
    autoMode: false,
    gameСlass: new GameClass(),
    pipes: [new Pipe(canvas.width, 0, speed)],
    score: 0,
    livesCount: 3,
    revel: false,
    revelTime: 2000,
  };

  game.Nav = (e) => {
    e = e || window.event;
    if (e.keyCode == '38') {
      game.gameСlass.bird.moveUp();
      game.gameСlass.bird.isMoving = true;
      setTimeout(() => {
        game.gameСlass.bird.isMoving = false;
      }, 2);
    }
    if (e.keyCode == '40') {
      game.gameСlass.bird.moveDown();
      game.gameСlass.bird.isMoving = true;
      setTimeout(() => {
        game.gameСlass.bird.isMoving = false;
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
      let closestPipe = game.pipes.reduce((stable, pipe) => {
        if (
          pipe.x >= -80 &&
          pipe.x + pipe.pipeUp.width > game.gameСlass.bird.xPos &&
          pipe.x < stable.x
        ) {
          return pipe;
        } else {
          return stable;
        }
      }, game.pipes[0]);

      let pipeCenter =
        closestPipe.y +
        closestPipe.pipeUp.height +
        closestPipe.gap / 2 +
        10;

      if (
        game.gameСlass.bird.yPos + game.gameСlass.bird.height / 2 > pipeCenter &&
        !game.gameСlass.bird.isMoving
      ) {
        game.gameСlass.bird.moveUp();
        game.gameСlass.bird.isMoving = true;
        setTimeout(() => {
          game.gameСlass.bird.isMoving = false;
        }, 50);
      } else if (
        game.gameСlass.bird.yPos + game.gameСlass.bird.height / 2 <
          closestPipe.y + closestPipe.pipeUp.height &&
        !game.gameСlass.bird.isMoving
      ) {
        game.gameСlass.bird.moveDown();
        game.gameСlass.bird.isMoving = true;
        setTimeout(() => {
          game.gameСlass.bird.isMoving = false;
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
        break;
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
        game.gameСlass.gameOver.draw(game.ctx);
      } else {
        setTimeout(() => {
          game.revel = false;
        }, game.revelTime);
      }
    }
  };

  game.drawScore = () => {
    game.ctx.font = '25px serif';
    game.ctx.fillStyle = 'yellow';
    game.ctx.fillText(game.score, game.canvas.width - 55, 52);
  };

  game.Realization = function () {
    game.gameСlass.background.draw(game.ctx);
    game.gameСlass.bird.yPos += 1.5;
    let render = false;
    let pipesToRemove = [];

    if (game.gameСlass.bird.yPos < 0) {
      game.gameСlass.bird.yPos = 0;
    }

    for (let i = 0; i < game.pipes.length; i++) {
      if (
        game.gameСlass.bird.yPos + game.gameСlass.bird.height >=
        game.canvas.height - game.gameСlass.foreground.height
      ) {
        game.gameСlass.bird.yPos = 0;
      }
      game.pipes[i].draw(game.ctx);
      game.pipes[i].move(game.speed);

      if (
        !render &&
        i === game.pipes.length - 1 &&
        (game.pipes[i].x === 123 ||
          game.pipes[i].x === 124 ||
          game.pipes[i].x === 125 ||
          game.pipes[i].x === 126)
      ) {
        console.log('RENDER');
        if (!render) {
          game.pipes.push(
            new Pipe(
              this.canvas.width + 80,
              Math.floor(
                Math.random() * this.pipes[i].pipeUp.height
              ) - this.pipes[i].pipeUp.height
            )
          );
          render = true;
        }
        break;
      } else if (
        game.pipes[i].x === -80 ||
        game.pipes[i].x === -79 ||
        game.pipes[i].x === -78 ||
        game.pipes[i].x === -81
      ) {
        pipesToRemove.push(game.pipes[i]);
        console.log('deleted');
      }

      if (
        game.gameСlass.bird.xPos + game.gameСlass.bird.width >= game.pipes[i].x &&
        game.gameСlass.bird.xPos <=
          game.pipes[i].x + game.pipes[i].pipeUp.width &&
        (game.gameСlass.bird.yPos <= game.pipes[i].y + game.pipes[i].pipeUp.height ||
          game.gameСlass.bird.yPos + game.gameСlass.bird.height >=
            game.pipes[i].y + game.pipes[i].pipeUp.height + game.pipes[i].gap)
      ) {
        game.birdRevel();
      }

      if (game.score >= 5) {
        if (
          11 ===
            game.pipes[i].x + game.pipes[i].pipeUp.width ||
          12 === game.pipes[i].x + game.pipes[i].pipeUp.width
        ) {
          game.score++;
          console.log('UPDATE:SCORE', game.score);
        }
      }

      if (game.gameСlass.bird.xPos === game.pipes[i].x + game.pipes[i].pipeUp.width) {
        game.score++;
        console.log('UPDATE:SCORE', game.score);
      }
    }

    for (let pipe of pipesToRemove) {
      game.pipes = game.pipes.filter((p) => p !== pipe);
    }

    game.autoModeLogic();
    game.gameСlass.bird.draw(game.ctx);
    game.gameСlass.foreground.draw(game.ctx, game.canvas);

    game.gameСlass.heart.draw(game.ctx, game.livesCount);
    game.drawScore();
    game.hardMod();

    if (game.livesCount > 0) {
      requestAnimationFrame(() => game.Realization());
    }
  };

  game.start = () => {
    document.addEventListener('keydown', (e) => game.Nav(e));
    game.Realization();
  };

  return game;
}

export default Game;
