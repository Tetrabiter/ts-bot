import Database  from "better-sqlite3";

const db = new Database('bookings.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    fullName TEXT NOT NULL,
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    UNIQUE(day, time) -- Запрещает повторные бронирования одного времени
  )
`);

export default db;