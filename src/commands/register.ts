import { Telegraf } from 'telegraf';

export default function registerCommands(bot: Telegraf) {
    bot.start((ctx) => ctx.reply('Добро пожаловать! Введите ваше имя и фамилию для регистрации.'));
    
    bot.on('text', (ctx) => {
        const text = ctx.message.text;
        const userId = ctx.message.from.id;
        if (text.includes(' ')) {
            const [firstName, lastName] = text.split(' ');
            ctx.reply(`Спасибо, ${firstName}! Теперь вы можете бронировать время.`);
        } else {
            ctx.reply('Пожалуйста, введите ваше имя и фамилию через пробел.');
        }
    });
}
