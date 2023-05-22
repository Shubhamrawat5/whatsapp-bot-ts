import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

export const command = () => {
  return { cmd: ["movie"], handler: handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { reply } = msgInfoObj;

  const text = `📛 Join PVX TG group:\n\nhttps://t.me/joinchat/J7FzKB1uYt0xNDVl`;
  reply(text);
};
