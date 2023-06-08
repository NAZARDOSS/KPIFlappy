const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path'); // Добавьте эту строку

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const databasePath = path.join(__dirname, 'database.json'); 

app.post('/save', (req, res) => {/////////////
  const { best } = req.body; 

  fs.readFile(databasePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read database' });
    } else {
      const scores = JSON.parse(data);
      const exists = scores.some((score) => score.best === best);

      if (exists) {
        res.status(400).json({ error: 'Unable to save equal best score' });
      } else {
        const newScore = { best, createdAt: new Date() };
        scores.push(newScore);

        fs.writeFile(databasePath, JSON.stringify(scores), (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to save score' });
          } else {
            res.status(200).json({ message: 'Score saved successfully' });
          }
        });
      }
    }
  });
});

app.get('/get', (req, res) => {
  fs.readFile(databasePath, 'utf8', (err, data) => {/////////////
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read database', details: err.message });
    } else {
      try {
        const scores = JSON.parse(data);///////////
        if (scores.length > 0) {
          const bestScore = scores.reduce((prev, current) => (prev.best > current.best ? prev : current));
          res.status(200).json({ best: bestScore.best });
        } else {
          res.status(200).json({ best: 0 });
        }
      } catch (parseError) {
        console.error(parseError);
        res.status(500).json({ error: 'Failed to parse database', details: parseError.message });
      }
    }
  });
});


app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
