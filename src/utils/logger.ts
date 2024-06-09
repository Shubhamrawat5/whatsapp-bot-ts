import TelegramBot from "node-telegram-bot-api";
import { Bot } from "../interfaces/Bot";

import { TgBotToken, ownerNumberWithJid } from "./config";

const kryptonChatId = 7139058343;
  // 649341653; // my chat id to receive all the updates
const botTG = TgBotToken
  ? new TelegramBot(TgBotToken, { polling: false })
  : null;

export const loggerBot = async (
  botWA: Bot | undefined,
  eventType: string,
  err: any,
  msgObj: any
) => {
  try {
    const errMsg = err.stack ? err.stack : err.toString();
    const msg = JSON.stringify(msgObj);

    console.log(err);
    const loggerMsg = `ERROR [${eventType}]:\n${errMsg}\nmsg: ${msg}`;
    if (botTG) await botTG.sendMessage(kryptonChatId, loggerMsg);
    if (botWA && ownerNumberWithJid) {
      await botWA.sendMessage(ownerNumberWithJid, {
        text: loggerMsg,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const loggerTg = async (message: string) => {
  try {
    if (botTG) await botTG.sendMessage(kryptonChatId, message);
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};

export const sendLogToOwner = async (bot: Bot, message: string) => {
  try {
    // if (ownerNumberWithJid) {
    //   await bot.sendMessage(ownerNumberWithJid, { text: message });
    // }
    if (botTG) await botTG.sendMessage(kryptonChatId, message);
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};
