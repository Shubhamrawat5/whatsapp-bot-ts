import TelegramBot from "node-telegram-bot-api";
import { Bot } from "../interface/Bot";

import { TgBotToken, myNumberWithJid } from "./config";

const kryptonChatId = 649341653; // my chat id to receive all the updates
const botTG = TgBotToken
  ? new TelegramBot(TgBotToken, { polling: false })
  : null;

export const loggerBot = async (
  botWA: Bot | undefined,
  eventType: string,
  err: any,
  msgObj: any
) => {
  const errMsg = err.stack ? err.stack : err.toString();
  const msg = JSON.stringify(msgObj);

  console.log(err);
  const loggerMsg = `ERROR [${eventType}]:\n${errMsg}\nmsg: ${msg}`;
  if (botTG) await botTG.sendMessage(kryptonChatId, loggerMsg);
  if (botWA && myNumberWithJid) {
    await botWA.sendMessage(myNumberWithJid, {
      text: loggerMsg,
    });
  }
};

export const loggerTg = async (message: string) => {
  if (botTG) await botTG.sendMessage(kryptonChatId, message);
};