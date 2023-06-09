import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import checkTodayBday from "../../functions/checkTodayBday";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from } = msgInfoObj;

  await checkTodayBday(bot, from, false);
};

const bday = () => {
  const cmd = ["bday"];

  return { cmd, handler };
};

export default bday;
