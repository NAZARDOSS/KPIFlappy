import React, { useEffect, useState } from 'react';
import Game from './components/Game.jsx';
import SideInfo from './components/SideInfo.jsx';
import styles from './style.scss';
import RightInfo from './components/RightInfo.jsx';

function App() {
  const [score, setScore] = useState(0);
  const [localBest, setLocalBest] = useState(0);
  const [serverBest, setServerBest] = useState(0);

  const updateScore = (newScore) => {
    setScore(newScore);

    if (newScore > localBest && newScore > serverBest) {
      setLocalBest(newScore);
    }
  };

  const restartGame = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const game = Game(canvas, ctx, 2, updateScore);
    game.start();
  };

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const game = Game(canvas, ctx, 2, updateScore);
    game.start();
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/get')
      .then((response) => response.json())
      .then((response) => {
        const { best: bestFromServer } = response;
        setServerBest(bestFromServer);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className="main">
      <h1 className="title">Flappy Bird</h1>
      <div className="container">
        <SideInfo score={score} best={Math.max(localBest, serverBest)} restartGame={restartGame} />
        <div className="game">
          <canvas id="canvas" width={390} height={525} />
        </div>
        <RightInfo />
      </div>
    </div>
  );
}

export default App;
