const express = require('express');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');
const db = require('./db/db');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.static('public'));


app.get('/notes', (req, res) => {
  if (res.statusCode === '404') return;
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
      id: nanoid(),
      title,
      text
    };

    db.push(newNote);
    console.log(db)
    updateDb(db);
    
    const response = {
      status: 'success',
      body: newNote
    };
    
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  };
});

app.delete('/api/notes/:id', (req, res) => {
  console.log(req.params.id)
  console.log('BALETED')
  console.log(db.indexOf(req.params.id))
  db.splice(db.indexOf(req.params.id));

  res.status(200);
});

app.get('*', (req, res) => { 
  if (res.statusCode === '404') return;
  res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);

function updateDb(db) {
  fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
    err ? console.log(new Error) : console.log('db.json updated!');
  });
}