import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

export default bot;
