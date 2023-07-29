import "dotenv/config";

export const ownerNumber = process.env.OWNER_NUMBER;
export const pvxFunctionsEnabled = process.env.PVX_FUNCTIONS_ENABLED;
export const forwardStickerEnabled = process.env.FORWARD_STICKER_ENABLED;
export const openAiKey = process.env.OPENAI_KEY;
export const databaseUrl = process.env.DATABASE_URL;
export const newsApiKey = process.env.NEWSAPI_KEY;
export const TgBotToken = process.env.TG_BOT_TOKEN; // tg bot token here

export const ownerNumberWithJid = ownerNumber
  ? `${ownerNumber}@s.whatsapp.net`
  : undefined;
