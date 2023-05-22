import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

export const command = () => {
  let cmd = ["dev"];

  return { cmd, handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  let text = `*─「 <{PVX}> BOT 」 ─*\n\n_Message https://t.me/KryptonPVX in telegram to report any bug or to give new ideas/features for this bot!_ `;

  await reply(text);
};
