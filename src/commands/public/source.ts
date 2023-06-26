import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const text = `*─「 <{PVX}> BOT 」 ─*\n\nJS: https://github.com/Shubhamrawat5/whatsapp-bot-md\nTS: https://github.com/Shubhamrawat5/whatsapp-bot-ts\n\nGive a star if you like or using this. Many new cool helpful commands will be keep on adding.`;

  await reply(text);
};

const source = () => {
  const cmd = ["source"];

  return { cmd, handler };
};

export default source;
