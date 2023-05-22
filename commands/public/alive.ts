import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

export const command = () => {
  let cmd = ["alive", "a"];

  return { cmd, handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  let text = `*─「 <{PVX}> BOT 」 ─*\n\nYES! BOT IS ALIVE !!!`;

  await reply(text);
};
