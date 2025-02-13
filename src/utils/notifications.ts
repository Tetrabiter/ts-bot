/*import { Telegraf } from 'telegraf';

// Ваш токен и ID чата, куда будут отправляться уведомления
const bot = new Telegraf('7770156807:AAFMlpJ7DhWCUle2Gj8i_-7pq-iXoWQLMmE');
const adminChatId = 'TimElesh'; // Замените на ваш Telegram ID

// Функция для отправки уведомления
export const sendBookingNotification = async (fullName: string, time: string) => {
  const message = `${fullName} забронировал урок на следующее время ${time}`;
  try {
    await bot.telegram.sendMessage(adminChatId, message);
    console.log('Уведомление отправлено:', message);
  } catch (error) {
    console.error('Ошибка при отправке уведомления:', error);
  }
};*/


import { Telegraf } from 'telegraf';

const bot = new Telegraf('7770156807:AAFMlpJ7DhWCUle2Gj8i_-7pq-iXoWQLMmE');

// Замените 'CHAT_ID' на фактический ID чата
const ADMIN_CHAT_ID = '987296287';

export function sendBookingNotification(fullName: string, time: string , chatId: number) {
  const message = `${fullName} забронировал урок на следующее время ${time}`;
  
  bot.telegram.sendMessage(ADMIN_CHAT_ID, message)
    .then(() => {
      console.log('Уведомление успешно отправлено.');
    })
    .catch((error) => {
      console.error('Ошибка при отправке уведомления:', error);
    });
}


/*import { Telegraf } from 'telegraf';

const bot = new Telegraf('7770156807:AAFMlpJ7DhWCUle2Gj8i_-7pq-iXoWQLMmE'); // Замените на ваш токен бота

export function sendBookingNotification(fullName: string, time: string, chatId: number) {
  const message = `${fullName} забронировал урок на следующее время ${time}`;
  bot.telegram.sendMessage(chatId, message).catch(err => {
    console.error('Ошибка при отправке уведомления:', err);
  });
}*/

