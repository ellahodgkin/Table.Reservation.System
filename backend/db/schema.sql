-- schema.sql

DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS restaurant_tables;

CREATE TABLE restaurant_tables (
    id            SERIAL PRIMARY KEY,
    seat_capacity INTEGER NOT NULL CHECK (seat_capacity > 0),
    shape         TEXT NOT NULL CHECK (shape IN ('square', 'circle', 'rectangle')),
    pos_top       TEXT NOT NULL,   -- e.g. '10%' (used directly as CSS)
    pos_left      TEXT NOT NULL    -- e.g. '25%'
);

CREATE TABLE reservations (
    id        SERIAL PRIMARY KEY,
    name      TEXT NOT NULL,
    date      DATE NOT NULL,
    time      TIME NOT NULL,
    guests    INTEGER NOT NULL CHECK (guests > 0),
    table_id  INTEGER NOT NULL REFERENCES restaurant_tables(id)
);

-- Run SELECT * FROM restaurant_tables; in psql and copy the values across.
INSERT INTO restaurant_tables (seat_capacity, shape, pos_top, pos_left) VALUES
    (6, 'rectangle', '5%',  '5%'),
    (6, 'rectangle', '5%',  '40%'),
    (4, 'square',    '40%', '8%'),
    (4, 'square',    '40%', '45%'),
    (4, 'square',    '5%',  '75%'),
    (4, 'square',    '40%', '75%'),
    (2, 'circle',    '72%', '8%'),
    (2, 'circle',    '72%', '30%'),
    (2, 'circle',    '72%', '55%'),
    (2, 'circle',    '72%', '80%');