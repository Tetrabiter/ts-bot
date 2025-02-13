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
                    [{ text: '19:00', callback_data: 'book_19:00' }],
                    [{ text: '20:00', callback_data: 'book_20:00' }],
                    [{ text: '21:00', callback_data: 'book_21:00' }],
                ],
            },
        });
    });
    bot.action(/book_(.+)/, (ctx) => {
        const timeSlot = ctx.match[1];
        ctx.reply(`Вы забронировали время: ${timeSlot}`);
    });
}
