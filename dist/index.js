"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const notifications_1 = require("./utils/notifications"); // Импорт функции отправки уведомлений
const dbFunctions_1 = require("./db/dbFunctions");
const db_1 = require("./db/db");
const bot = new telegraf_1.Telegraf('7770156807:AAFMlpJ7DhWCUle2Gj8i_-7pq-iXoWQLMmE'); // Замените на ваш токен бота
(0, db_1.connectDB)(); // Подключение к MongoDB при запуске бота
// Хранение состояния пользователя
const userState = {};
// Функция для генерации кнопок времени
function generateTimeButtons(day) {
    const times = ['17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'];
    return times.map(time => {
        // Вызов функции проверки состояния бронирования из базы данных можно добавить здесь
        const isTaken = false; // Нужно заменить на реальную проверку из базы данных
        const buttonText = isTaken ? `❌ ${time}` : `✅ ${time}`;
        return telegraf_1.Markup.button.callback(buttonText, `${day}_${time}`);
    });
}
// Функция для генерации кнопок дней недели
function generateDayButtons() {
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
    return days.map(day => telegraf_1.Markup.button.callback(day, `day_${day}`));
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
        ctx.reply(`Спасибо, ${text.split(' ')[0]}! Теперь выберите день недели для бронирования.`, telegraf_1.Markup.inlineKeyboard(generateDayButtons(), { columns: 3 }));
    }
    else {
        ctx.reply('Вы уже зарегистрированы. Пожалуйста, выберите день недели для бронирования.', telegraf_1.Markup.inlineKeyboard(generateDayButtons(), { columns: 3 }));
    }
});
bot.action(/day_(.+)/, (ctx) => {
    const selectedDay = ctx.match[1];
    ctx.reply(`Вы выбрали ${selectedDay}. Теперь выберите время:`, telegraf_1.Markup.inlineKeyboard(generateTimeButtons(selectedDay), { columns: 2 }));
});
bot.action(/(.+)_(.+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [day, time] = ctx.match.slice(1);
    const fullName = ((_a = userState[ctx.from.id]) === null || _a === void 0 ? void 0 : _a.fullName) || 'Пользователь';
    // Правильный порядок аргументов для addBooking
    const bookingExists = yield (0, dbFunctions_1.addBooking)(ctx.from.id, fullName, day, time);
    if (bookingExists) {
        ctx.reply('Это время уже занято. Пожалуйста, выберите другое время.');
    }
    else {
        ctx.reply(`Вы успешно забронировали время ${time} на ${day}.`);
        if (ctx.chat) {
            (0, notifications_1.sendBookingNotification)(fullName, `${time} на ${day}`, ctx.chat.id);
        }
        else {
            console.error('Ошибка: ctx.chat не определен.');
        }
    }
}));
bot.launch();
console.log('Бот запущен!');
