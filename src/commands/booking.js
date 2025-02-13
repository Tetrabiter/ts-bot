"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = bookingCommands;
function bookingCommands(bot) {
    bot.command('book', (ctx) => {
        ctx.reply('Выберите удобное время:', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '17:00', callback_data: 'book_17:00' }],
                    [{ text: '18:00', callback_data: 'book_18:00' }],
                    // Добавь остальные слоты
                ],
            },
        });
    });
    bot.action(/book_(.+)/, (ctx) => {
        const timeSlot = ctx.match[1];
        ctx.reply(`Вы забронировали время: ${timeSlot}`);
    });
}
