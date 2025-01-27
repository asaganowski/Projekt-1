import express from 'express';
import pool from '../config/db.js';

const authRoutes = express.Router();

authRoutes.get('/users', async (req, res) => {
  try {

    const userQuery = 'SELECT * FROM klinika.uzytkownicy';

    const result = await pool.query(userQuery);

    res.json({ 
      msg: 'Załadowano dane', 
      status: 200,
      payload: result.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      payload: '',
      msg: 'Wystąpił błąd serwera', 
      status: 500
    });
  }
});

authRoutes.post('/login', async (req, res) => {
  const { login, haslo } = req.body;

  try {
    const userQuery = 'SELECT * FROM klinika.uzytkownicy WHERE login = $1';
    const result = await pool.query(userQuery, [login]);

    if (result.rows.length === 0) {
      return res.status(401).json({ payload: '', status: 401, msg: 'Nieprawidłowy login lub hasło' });
    }

    const user = result.rows[0];
    const isPasswordValid = haslo == user.haslo;

    if (!isPasswordValid) {
      return res.status(401).json({ payload: '', status: 401, msg: 'Nieprawidłowy login lub hasło' });
    }

    res.json({ status: 200, msg: 'Ok', payload: { id: user.id_uzytkownika, login: user.login, rola: user.rola, imie: user.imie, nazwisko: user.nazwisko } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ payload: '', status: 500, msg: 'Wystąpił błąd serwera' });
  }
});

export default authRoutes;
