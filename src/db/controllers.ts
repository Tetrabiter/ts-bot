import { client } from './database';
import { ObjectId } from 'mongodb';

export const addBooking = async (userId: number, fullName: string, day: string, time: string): Promise<boolean> => {
  const db = client.db('botdb');
  const bookings = db.collection('bookings');

  try {
    // Проверяем, существует ли уже бронирование на это время
    const existingBooking = await bookings.findOne({ day, time });
    if (existingBooking) {
      return true; // Бронирование уже существует
    }

    await bookings.insertOne({
      userId,
      fullName,
      day,
      time,
      createdAt: new Date(),
    });

    return false; // Бронирование успешно создано
  } catch (err) {
    console.error('Error adding booking:', err);
    throw err;
  }
};