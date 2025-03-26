import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import {} from "../../db/countMemberTodayDB";
import todayStats from "../../functions/todayStats";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const message = await todayStats(bot);
  await reply(message);
};

const today = () => {
  const cmd = ["today"];

  return { cmd, handler };
};

export default today;
