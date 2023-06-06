import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getTechNews } from "../../functions/getTechNews";

export const technews = () => {
  const cmd = ["technews", "tn"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from } = msgInfoObj;

  const news = await getTechNews();

  await bot.sendMessage(from, { text: news }, { quoted: msg });
};
