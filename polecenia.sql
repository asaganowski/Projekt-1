
CREATE SCHEMA IF NOT EXISTS klinika;

CREATE TYPE rola_typ AS ENUM ('ADMIN', 'PACJENT', 'SPECJALISTA');
CREATE TYPE specjalizacja_typ AS ENUM (
    'Kardiologia',
    'Pediatria',
    'Dermatologia',
    'Chirurgia',
    'Onkologia',
    'Neurologia'
);

CREATE TABLE IF NOT EXISTS klinika.uzytkownicy (
    id_uzytkownika SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    haslo VARCHAR(255) NOT NULL,
    rola rola_typ NOT NULL,
    specjalizacja specjalizacja_typ,
    CHECK (
        (rola = 'SPECJALISTA' AND specjalizacja IS NOT NULL) OR
        (rola != 'SPECJALISTA' AND specjalizacja IS NULL)
    )
);

ALTER TABLE klinika.uzytkownicy
ADD COLUMN imie VARCHAR(50) NOT NULL,
ADD COLUMN nazwisko VARCHAR(50) NOT NULL;


CREATE TABLE IF NOT EXISTS klinika.placowki (
    id_placowki SERIAL PRIMARY KEY,
    nazwa VARCHAR(100) NOT NULL,
    adres VARCHAR(200) NOT NULL,
    telefon VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS klinika.specjalista_placowki (
    id_specjalisty INT NOT NULL,
    id_placowki INT NOT NULL,
    PRIMARY KEY (id_specjalisty, id_placowki),
    CONSTRAINT fk_specjalista FOREIGN KEY (id_specjalisty)
            REFERENCES klinika.uzytkownicy (id_uzytkownika) ON DELETE CASCADE,
    CONSTRAINT fk_placowka FOREIGN KEY (id_placowki)
            REFERENCES klinika.placowki (id_placowki) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION validate_specialist_role()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT rola FROM klinika.uzytkownicy
        WHERE id_uzytkownika = NEW.id_specjalisty) != 'SPECJALISTA' THEN
            RAISE EXCEPTION 'Tylko użytkownicy z rolą SPECJALISTA mogą być dodawani do tej tabeli.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_specialist_role
BEFORE INSERT ON klinika.specjalista_placowki
FOR EACH ROW
EXECUTE FUNCTION validate_specialist_role();


INSERT INTO klinika.placowki (nazwa, adres, telefon)
VALUES ('Placówka 2', 'Ul. Warszawska 10, Krakow', '123-123-123');

INSERT INTO klinika.specjalista_placowki (id_specjalisty, id_placowki)
VALUES (1, 1);


CREATE TABLE IF NOT EXISTS klinika.wizyty (
    id_wizyty SERIAL PRIMARY KEY,
    data_wizyty TIMESTAMP NOT NULL,
    id_placowki INT NOT NULL,
    id_pacjenta INT NOT NULL,
    id_specjalisty INT NOT NULL,
    FOREIGN KEY (id_placowki) REFERENCES klinika.placowki (id_placowki)
        ON DELETE CASCADE,
    FOREIGN KEY (id_pacjenta) REFERENCES klinika.uzytkownicy (id_uzytkownika)
        ON DELETE CASCADE,
    FOREIGN KEY (id_specjalisty) REFERENCES klinika.uzytkownicy (id_uzytkownika)
        ON DELETE CASCADE,
    CHECK (id_pacjenta != id_specjalisty)
);


CREATE OR REPLACE FUNCTION klinika.sprawdz_konflikty_wizyt()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM klinika.wizyty
        WHERE id_specjalisty = NEW.id_specjalisty
          AND NEW.data_wizyty BETWEEN
              data_wizyty - INTERVAL '15 minutes' AND data_wizyty + INTERVAL '15 minutes'
    ) THEN
        RAISE EXCEPTION 'Specjalista ma już wizytę zaplanowaną na ten czas';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER sprawdz_konflikty_wizyt_trigger
BEFORE INSERT OR UPDATE ON klinika.wizyty
FOR EACH ROW
EXECUTE FUNCTION klinika.sprawdz_konflikty_wizyt();

SELECT * FROM klinika.uzytkownicy;

CREATE OR REPLACE VIEW klinika.placowki_z_iloscia_specjalistow AS
SELECT
    p.id_placowki,
    p.nazwa,
    p.adres,
    p.telefon,
    COUNT(sp.id_specjalisty) AS ilosc_specjalistow
FROM
    klinika.placowki p
LEFT JOIN
    klinika.specjalista_placowki sp ON p.id_placowki = sp.id_placowki
GROUP BY
    p.id_placowki
ORDER BY
    p.nazwa ASC;



CREATE OR REPLACE FUNCTION klinika.get_wizyty(
    in_id_uzytkownika INT,
    in_rola rola_typ
)
RETURNS TABLE (
    id_wizyty INT,
    data_wizyty TIMESTAMP,
    nazwa_placowki varchar(100),
    adres_placowki VARCHAR(200),
    uczestnik TEXT,
    specjalizacja specjalizacja_typ,
    za_ile_dni INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        w.id_wizyty,
        w.data_wizyty,
        p.nazwa AS nazwa_placowki,
        p.adres AS adres_placowki,
        CASE
            WHEN in_rola = 'PACJENT' THEN spec.imie || ' ' || spec.nazwisko
            WHEN in_rola = 'SPECJALISTA' THEN pac.imie || ' ' || pac.nazwisko
        END AS uczestnik,
        spec.specjalizacja,
        ROUND(DATE_PART('day', w.data_wizyty - CURRENT_DATE))::INTEGER AS za_ile_dni
    FROM
        klinika.wizyty w
    JOIN
        klinika.placowki p ON w.id_placowki = p.id_placowki
    JOIN
        klinika.uzytkownicy pac ON w.id_pacjenta = pac.id_uzytkownika
    JOIN
        klinika.uzytkownicy spec ON w.id_specjalisty = spec.id_uzytkownika
    WHERE
        (in_rola = 'PACJENT' AND w.id_pacjenta = in_id_uzytkownika) OR
        (in_rola = 'SPECJALISTA' AND w.id_specjalisty = in_id_uzytkownika)
    ORDER BY
        w.data_wizyty ASC;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM klinika.uzytkownicy;

CREATE OR REPLACE VIEW klinika.uzytkownicy_z_placowkami AS
SELECT
    u.id_uzytkownika,
    u.login,
    u.rola,
    u.specjalizacja,
    u.imie,
    u.nazwisko,
    CASE
        WHEN u.rola = 'SPECJALISTA' THEN STRING_AGG(p.nazwa, ', ')
        ELSE NULL
    END AS placowki
FROM
    klinika.uzytkownicy u
LEFT JOIN
    klinika.specjalista_placowki sp ON u.id_uzytkownika = sp.id_specjalisty
LEFT JOIN
    klinika.placowki p ON sp.id_placowki = p.id_placowki
GROUP BY
    u.id_uzytkownika, u.login, u.rola, u.specjalizacja, u.imie, u.nazwisko
HAVING
    u.rola != 'ADMIN';

SELECT * FROM klinika.uzytkownicy_z_placowkami;
