import express from 'express';
import pool from './src/config/db.js';
import app from './app.js';

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello z serwera Node.js!');
});

app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
});
