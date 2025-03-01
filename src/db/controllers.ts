import db from './database';

export function addBooking(userId: number, fullName: string, day: string, time: string): boolean {
  const registrationDate = new Date().toLocaleDateString('ru-RU');

  try {
    const stmt = db.prepare(`
      INSERT INTO bookings (userId, fullName, day, time, registrationDate) 
      VALUES (?, ?, ?, ?, ?)'
    `);
    stmt.run(userId, fullName, day, time, registrationDate);
    return false; // Бронирование успешно
  } catch (error) {
    if ((error as any).code === 'SQLITE_CONSTRAINT') {
      return true; // Время уже занято
    }
    throw error;
  }
}

export function isTimeTaken(day: string, time: string): boolean {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE day = ? AND time = ?');
  const result = stmt.get(day, time) as { count: number };
  return result.count > 0;
}