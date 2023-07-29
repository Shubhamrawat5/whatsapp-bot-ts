import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const text = `*─「 <{PVX}> BOT 」 ─*\n\n_Message https://t.me/KryptonPVX in telegram to report any bug or to give new ideas/features for this bot!_ `;

  await reply(text);
};

const dev = () => {
  const cmd = ["dev"];

  return { cmd, handler };
};

export default dev;
