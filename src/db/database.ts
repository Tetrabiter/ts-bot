import Database  from "better-sqlite3";

const db = new Database('bookings.db');

db.exec(`
  ALTER TABLE bookings ADD COLUMN registrationDate TEXT DEFAULT '';
`);

export default db;