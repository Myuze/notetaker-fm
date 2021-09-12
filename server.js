// Global Requirements
const express = require('express');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');
const db = require('./db/db');

// Default Port
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Notes Main Index Route
app.get('/notes', (req, res) => {
  if (res.statusCode === '404') return;
  res.status(200).sendFile(path.join(__dirname, 'public/notes.html'));
});

// Notes API route
app.get('/api/notes', (req, res) => {
  if (res.statusCode === '404') return;
  res.status(200).json(db);
});

// Add a new note using the post API route
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (title) {
    const newNote = {
      id: nanoid(),
      title,
      text
    };

    db.push(newNote);
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

// Delete note by Id route
app.delete('/api/notes/:id', (req, res) => {
  // Find index of object to be deleted by id
  let index = db.findIndex(note => note.id === req.params.id);

  let deleted = db.splice(index, 1);
  console.log(`${JSON.stringify(deleted)} DELETED`);
  updateDb(db);
  
  res.status(200).json(db);
});

// Default route to main Note Taker page
app.get('*', (req, res) => { 
  if (res.statusCode === '404') return;
  res.status(200).sendFile(path.join(__dirname, 'public/index.html'));
});

// Server Listener
app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);

// Update notes JSON
function updateDb(db) {
  fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
    err ? console.log(new Error) : console.log('db.json updated!');
  });
}