PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itinerary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day INTEGER NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS itinerary_metadata (
    id INTEGER PRIMARY KEY,
    title TEXT,
    period TEXT
);

-- Insert some initial data for demonstration
INSERT INTO itinerary (day, title, details) VALUES (1, 'Itinerary Item 1', 'Details about itinerary item 1 for Day 1.');
INSERT INTO itinerary (day, title, details) VALUES (1, 'Itinerary Item 2', 'Details about itinerary item 2 for Day 1.');
INSERT INTO itinerary (day, title, details) VALUES (2, 'Itinerary Item 1', 'Details about itinerary item 1 for Day 2.');
INSERT INTO itinerary (day, title, details) VALUES (2, 'Itinerary Item 2', 'Details about itinerary item 2 for Day 2.');
INSERT INTO itinerary (day, title, details) VALUES (3, 'Itinerary Item 1', 'Details about itinerary item 1 for Day 3.');
INSERT INTO itinerary (day, title, details) VALUES (3, 'Itinerary Item 2', 'Details about itinerary item 2 for Day 3.');

INSERT INTO itinerary_metadata (id, title, period) VALUES (1, 'My Itinerary', 'August 2024');

SELECT * FROM itinerary_metadata WHERE id = 1;

COMMIT;
