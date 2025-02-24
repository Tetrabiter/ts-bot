import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import { sendBookingNotification } from './utils/notifications'; // Импорт функции отправки уведомлений
import { addBooking , isTimeTaken } from './db/controllers';

const bot = new Telegraf('7770156807:AAFMlpJ7DhWCUle2Gj8i_-7pq-iXoWQLMmE'); // Замените на ваш токен бота

// Хранение состояния пользователя
const userState: { [key: number]: { isRegistered: boolean; fullName?: string; } } = {};

// Функция для генерации кнопок времени
function generateTimeButtons(day: string) {
  const times = ['17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'];
  return times.map(time => {
    const isTaken = isTimeTaken(day, time);
    const buttonText = isTaken ? `❌ ${time}` : `✅ ${time}`;
    return Markup.button.callback(buttonText, `${day}_${time}`);
  });
}

// Функция для генерации кнопок дней недели
function generateDayButtons() {
  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
  return days.map(day => Markup.button.callback(day, `day_${day}`));
}

bot.start((ctx) => {
  const userId = ctx.from.id;
  if (!userState[userId]) {
    userState[userId] = { isRegistered: false };
  }

  if (ctx.chat) {
    console.log(`User ID (chat_id): ${ctx.chat.id}`); // Это выведет chat_id пользователя
  }

  ctx.reply('Добро пожаловать! Введите ваше имя и фамилию для регистрации.');
});

bot.on('text', (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text.trim();

  if (!userState[userId].isRegistered) {
    userState[userId].fullName = text;
    userState[userId].isRegistered = true;
    ctx.reply(`Спасибо, ${text.split(' ')[0]}! Теперь выберите день недели для бронирования.`,
      Markup.inlineKeyboard(generateDayButtons(), { columns: 3 })
    );
  } else {
    ctx.reply('Вы уже зарегистрированы. Пожалуйста, выберите день недели для бронирования.',
      Markup.inlineKeyboard(generateDayButtons(), { columns: 3 })
    );
  }
});

bot.action(/day_(.+)/, (ctx) => {
  const selectedDay = ctx.match[1];
  ctx.reply(`Вы выбрали ${selectedDay}. Теперь выберите время:`, 
    Markup.inlineKeyboard(generateTimeButtons(selectedDay), { columns: 2 })
  );
});

bot.action(/(.+)_(.+)/, async (ctx) => {
  const [day, time] = ctx.match.slice(1);
  const fullName = userState[ctx.from.id]?.fullName || 'Пользователь';

  // Правильный порядок аргументов для addBooking
  const bookingExists = await addBooking(ctx.from.id, fullName, day, time);
  
  if (bookingExists) {
    ctx.reply('Это время уже занято. Пожалуйста, выберите другое время.');
  } else {
    ctx.reply(`Вы успешно забронировали время ${time} на ${day}.`);

    if (ctx.chat) {
      sendBookingNotification(fullName, `${time} на ${day}`, ctx.chat.id);
    } else {
      console.error('Ошибка: ctx.chat не определен.');
    }
  }
});


bot.launch();

console.log('Бот запущен!');