const express = require('express');
const path = require('path');
const db = require('./db/db');

const PORT = 3001;

const app = express();

app.use(express.json());

app.get('*', (req, res) => { 
  if (res.statusCode === '404') return;
  res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  if (res.statusCode === '404') return;
  console.log(path.join(__dirname, 'public/notes.html'));
  res.status(200).sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  if (res.statusCode === '404') return;
  res.status(200).json(db);
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (title) {
    const newNote = {
      title,
      text
    };

    const response = {
      status: 'success',
      body: newNote
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);