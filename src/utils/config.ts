import "dotenv/config";

// TODO: IMPROVE NAMING
export const myNumber = process.env.OWNER_NUMBER;
export const pvx = process.env.PVX;
export const isForwardSticker = process.env.FORWARD_STICKER;
export const openAiKey = process.env.OPENAI;
export const databaseUrl = process.env.DATABASE_URL;
export const newsApi = process.env.NEWSAPI;
export const TgBotToken = process.env.TG_BOT; // tg bot token here

export const myNumberWithJid = myNumber
  ? `${myNumber}@s.whatsapp.net`
  : undefined;
