import React, { useState, useEffect } from 'react';

function SideInfo({ score, best, restartGame }) {
  const [data, setData] = useState(null);
  const [inputValue, setInputValue] = useState(best);
  const [error, setError] = useState(null);

  useEffect(() => {
    setData(best);
    setInputValue(best);
  }, [best]);

  const handleRestart = () => {
    restartGame();
  };

  useEffect(() => {
    handleGet();
  }, []);

  const handleGet = () => {
    fetch('http://localhost:3001/get')
      .then((response) => response.json())
      .then((response) => {
        setData(response.best);
        setInputValue(response.best);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSave = () => {
    fetch('http://localhost:3001/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ best: parseInt(inputValue) }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setTimeout(() => {
            setError(null);
          }, 2500);
        } else {
          setError(null);
          setData(response.best);
          handleGet();
          setInputValue(response.best);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const errorStyles = {
    color: 'red',
    opacity: error ? 1 : 0,
    transition: 'opacity 1s ease', 
  };

  return (
    <div className="record">
      <h1>Your Score: {score}</h1>
      <h1>Your Best: {data}</h1>
      <div>
        <div>
          <button onClick={handleRestart}>Restart Game</button>
        </div>
        <div style={{ marginBottom: '5px' }}>
          <button onClick={handleSave}>SAVE</button>
        </div>
        <div style={{ margin: 0, padding: 0 }}>
          <h5 style={errorStyles}>{error}</h5>
        </div>
      </div>
    </div>
  );
}

export default SideInfo;
