import express from 'express';
import pool from '../config/db.js';

const appointmentsRoutes = express.Router();

appointmentsRoutes.post('', async (req, res) => {
  const { data_wizyty, id_placowki, id_pacjenta, id_specjalisty } = req.body;

  if (!data_wizyty || !id_placowki || !id_pacjenta || !id_specjalisty) {
    return res.status(400).json({
      payload: null,
      msg: 'Wszystkie pola (data_wizyty, id_placowki, id_pacjenta, id_specjalisty) są wymagane',
      status: 400,
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO klinika.wizyty (data_wizyty, id_placowki, id_pacjenta, id_specjalisty)
      VALUES ($1, $2, $3, $4) RETURNING *;
      `,
      [data_wizyty, id_placowki, id_pacjenta, id_specjalisty]
    );

    res.status(201).json({
      payload: result.rows[0],
      msg: 'Wizyta została dodana pomyślnie',
      status: 201,
    });
  } catch (err) {
    console.error('Błąd podczas dodawania wizyty:', err);

    if (err.code === 'P0001' && err.message.includes('Specjalista ma już wizytę zaplanowaną na ten czas')) {
      return res.status(409).json({
        payload: null,
        msg: 'Specjalista ma już wizytę zaplanowaną na ten czas. Proszę wybrać inną godzinę.',
        status: 409,
      });
    }

    if (err.code === '23503') {
      return res.status(400).json({
        payload: null,
        msg: 'Podano nieprawidłowe ID pacjenta, specjalisty lub placówki. Upewnij się, że wszystkie ID są poprawne.',
        status: 400,
      });
    }

    if (err.code === '23502') {
      return res.status(400).json({
        payload: null,
        msg: 'Nie wszystkie wymagane pola zostały wypełnione.',
        status: 400,
      });
    }

    res.status(500).json({
      payload: null,
      msg: 'Wystąpił błąd podczas dodawania wizyty',
      status: 500,
    });
  }
});


appointmentsRoutes.get('/', async (req, res) => {
  const { id_uzytkownika, rola } = req.query;

  if (!id_uzytkownika || !rola) {
      return res.status(400).json({ 
        payload: null,
          msg: 'Brak wymaganych parametrów: id_uzytkownika i rola', 
          status: 400 
      });
  }

  try {
      const query = `
          SELECT * 
          FROM klinika.get_wizyty($1, $2)
      `;
      const values = [parseInt(id_uzytkownika, 10), rola];

      const result = await pool.query(query, values);

      res.status(200).json({
          payload: result.rows,
          msg: 'Pobrano wizyty',
          status: 200,
      });
  } catch (err) {
      console.error('Błąd podczas pobierania wizyt:', err);
      res.status(500).json({
          payload: null,
          msg: 'Nie udało się pobrać wizyt',
          status: 500,
      });
  }
});

appointmentsRoutes.delete('/:id_wizyty', async (req, res) => {
  const { id_wizyty } = req.params;

  if (!id_wizyty) {
    return res.status(400).json({
      payload: null,
      msg: 'Brak wymaganego parametru: id_wizyty',
      status: 400,
    });
  }

  try {
    const query = `
      DELETE FROM klinika.wizyty
      WHERE id_wizyty = $1
      RETURNING *;
    `;
    const values = [parseInt(id_wizyty, 10)];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        payload: null,
        msg: 'Wizyta o podanym ID nie została znaleziona',
        status: 404,
      });
    }

    res.status(200).json({
      payload: result.rows[0],
      msg: 'Wizyta została usunięta pomyślnie',
      status: 200,
    });
  } catch (err) {
    console.error('Błąd podczas usuwania wizyty:', err);
    res.status(500).json({
      payload: null,
      msg: 'Wystąpił błąd podczas usuwania wizyty',
      status: 500,
    });
  }
});



export default appointmentsRoutes;
