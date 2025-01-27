import express from 'express';
import pool from '../config/db.js';

const usersRoutes = express.Router();

usersRoutes.get('', async (req, res) => {
  try {

    let userQuery = 'SELECT * FROM klinika.uzytkownicy_z_placowkami';
    const queryParams = [];

    const result = await pool.query(userQuery, queryParams);

    res.json({
      payload: result.rows,
      msg: 'Ok',
      status: 200,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      payload: result.rows,
      msg: 'Wystąpił błąd serwera',
      status: 500,
    });
  }
});

usersRoutes.post('', async (req, res) => {
  const { login, haslo, rola, specjalizacja, placowki_id, imie, nazwisko } = req.body;

  // Walidacja danych wejściowych
  if (!login || !haslo || !rola || !imie || !nazwisko) {
      return res.status(400).json({ payload: '', status: 400, msg: 'Login, hasło, rola, imię i nazwisko są wymagane.' });
  }

  if (rola === 'SPECJALISTA' && (!specjalizacja || placowki_id.length === 0)) {
      return res.status(400).json({ payload: '', status: 400, msg: 'Specjalizacja i przynajmniej jedna placówka są wymagane dla roli SPECJALISTA.' });
  }

  const client = await pool.connect();
  try {
      await client.query('BEGIN');

      const insertUserQuery = `
          INSERT INTO klinika.uzytkownicy (login, haslo, rola, specjalizacja, imie, nazwisko)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_uzytkownika;
      `;
      const userValues = [
          login,
          haslo,
          rola,
          rola === 'SPECJALISTA' ? specjalizacja : null,
          imie,
          nazwisko,
      ];
      const userResult = await client.query(insertUserQuery, userValues);

      const userId = userResult.rows[0].id_uzytkownika;

      // if (rola === 'SPECJALISTA') {
          const insertPlacowkiQuery = `
              INSERT INTO klinika.specjalista_placowki (id_specjalisty, id_placowki)
              VALUES ($1, $2);
          `;

          for (const placowkaId of placowki_id) {
              await client.query(insertPlacowkiQuery, [userId, placowkaId]);
          }
      // }

      await client.query('COMMIT');

      res.status(201).json({
        payload: '', 
          status: 201,
          msg: `Dodano użytkownika o roli ${rola} i przypisano do placówek.`
      });
  } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);

      if (err.code === '23505') {
          res.status(400).json({payload: '',  status: 400, msg: 'Login jest już zajęty.' });
      } else if(err.code == 'P0001'){
        res.status(400).json({payload: '',  status: 400, msg: 'Nie można dodać spcjalizacji jeśli wybrana rola jest inna niż SPECJALISTA.' });
      } else {
          res.status(500).json({payload: '',  status: 500, msg: 'Błąd serwera.' });
      }
  } finally {
      client.release();
  }
});

usersRoutes.get('/:id/placowki', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT u.id_uzytkownika, u.imie, u.nazwisko, u.specjalizacja
      FROM klinika.uzytkownicy u
      INNER JOIN klinika.specjalista_placowki sp ON u.id_uzytkownika = sp.id_specjalisty
      WHERE sp.id_placowki = $1 AND u.rola = 'SPECJALISTA';
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ payload: null, msg: 'Brak specjalistów w tej placówce', status: 404 });
    }

    res.status(200).json({ payload: result.rows, msg: 'Pobrano listę specjalistów', status: 200 });
  } catch (err) {
    console.error('Błąd podczas pobierania specjalistów:', err);
    res.status(500).json({ payload: null, msg: 'Nie udało się pobrać listy specjalistów', status: 500 });
  }
});





export default usersRoutes;