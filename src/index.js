"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("./bot"));
const register_1 = __importDefault(require("./commands/register"));
const booking_1 = __importDefault(require("./commands/booking"));
// Инициализация команд
(0, register_1.default)(bot_1.default);
(0, booking_1.default)(bot_1.default);
// Запуск бота
bot_1.default.launch().then(() => {
    console.log('Bot is running...');
}).catch(err => {
    console.error('Failed to launch bot:', err);
});
