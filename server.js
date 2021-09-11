const express = require('express');
const db = require('./db/db');

const PORT = 3001;

const app = express();


app.use(express.json());

app.get('/', (req, res) => {
  console.log('GET Root');

  return res.status(200).json(db);
})

app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);