const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb+srv://test:test@cluster1.u9d3exf.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const Score = mongoose.model('Score', {
  best: Number,
  createdAt: { type: Date, default: Date.now }
});


app.post('/save', (req, res) => {
    const { best } = req.body;
  
    
    Score.exists({ best: best })
      .then((exists) => {
        if (exists) {
          res.status(400).json({ error: "Unable to save equal best score." });
        } else {
          
          const score = new Score({ best });
  
          
          score.save()
            .then(() => {
              res.status(200).json({ message: 'Score saved successfully' });
            })
            .catch((error) => {
              res.status(500).json({ error: 'Failed to save score' });
            });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Failed to check score existence' });
      });
  });
  
  

app.get('/get', (req, res) => {
  Score.findOne().sort({ createdAt: -1 }).exec()
    .then((score) => {
      if (score) {
        res.status(200).json({ best: score.best });
      } else {
        res.status(200).json({ best: 0 });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch score' });
    });
});


app.listen(3001, () => {
  console.log('Server is running on port 3001');
});