import express from 'express';
import pool from '../config/db.js';

const placowkiRoutes = express.Router();

placowkiRoutes.post('', async (req, res) => {
  const { nazwa, adres, telefon } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO klinika.placowki (nazwa, adres, telefon) VALUES ($1, $2, $3) RETURNING *',
      [nazwa, adres, telefon]
    );
    res.status(200).json({ payload: result.rows, msg: 'Placówka została dodana pomyślnie', status: 200 });
  } catch (err) {
    console.error('Błąd podczas dodawania placówki:', err);
    res.status(500).json({ payload: null, msg: 'Nie udało się dodać placówki', status: 500 });
  }
});

// Edytuj istniejącą placówkę
placowkiRoutes.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { nazwa, adres, telefon } = req.body;
  try {
    const result = await pool.query(
      'UPDATE klinika.placowki SET nazwa = $1, adres = $2, telefon = $3 WHERE id_placowki = $4 RETURNING *',
      [nazwa, adres, telefon, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ payload: null, msg: 'Nie znaleziono placówki o podanym ID', status: 404 });
    }
    res.status(200).json({ payload: result.rows, msg: 'Placówka została zaktualizowana', status: 200 });
  } catch (err) {
    console.error('Błąd podczas edytowania placówki:', err);
    res.status(500).json({ payload: null, msg: 'Nie udało się zaktualizować placówki', status: 500 });
  }
});

// Usuń placówkę
placowkiRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM klinika.placowki WHERE id_placowki = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ payload: null, msg: 'Nie znaleziono placówki do usunięcia', status: 404 });
    }
    res.status(200).json({ payload: result.rows, msg: 'Placówka została usunięta', status: 200 });
  } catch (err) {
    console.error('Błąd podczas usuwania placówki:', err);
    res.status(500).json({ payload: null, msg: 'Nie udało się usunąć placówki', status: 500 });
  }
});

// Pobierz wszystkie placówki
placowkiRoutes.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM klinika.placowki_z_iloscia_specjalistow');
    res.status(200).json({ payload: result.rows, msg: 'Pobrano listę placówek', status: 200 });
  } catch (err) {
    console.error('Błąd podczas pobierania placówek:', err);
    res.status(500).json({ payload: null, msg: 'Nie udało się pobrać listy placówek', status: 500 });
  }
});

export default placowkiRoutes;
