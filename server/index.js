const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;
const spotifyAuth = require('./spotifyAuth');
const spotifySearch = require('./spotifySearch');



app.use(cors());          // allow requests from frontend
app.use(express.json());  // parse JSON bodies
app.use('/spotify', spotifyAuth);
app.use('/spotify', spotifySearch);



let songs = [
  { id: 1, title: 'Song A', artist: 'Artist X' },
  { id: 2, title: 'Song B', artist: 'Artist Y' }
];


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



app.get('/songs', (req, res) => {
  res.json(songs);
});

app.post('/songs', (req, res) => {
  const { title, artist } = req.body;
  const newSong = { id: songs.length + 1, title, artist };
  songs.push(newSong);
  res.status(201).json(newSong);
});