import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import checkTodayBday from "../../functions/checkTodayBday";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from, reply } = msgInfoObj;

  const checkTodayBdayRes = await checkTodayBday(bot, from, false);
  if (!checkTodayBdayRes) {
    await reply("❌ THERE IS SOME PROBLEM WITH BDAY INFO!");
  }
};

const bday = () => {
  const cmd = ["bday"];

  return { cmd, handler };
};

export default bday;
