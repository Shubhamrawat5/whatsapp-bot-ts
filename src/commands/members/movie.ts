import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const text = `📛 Join PVX TG group:\n\nhttps://t.me/joinchat/J7FzKB1uYt0xNDVl`;
  await reply(text);
};

const movie = () => {
  const cmd = ["movie"];

  return { cmd, handler };
};

export default movie;
