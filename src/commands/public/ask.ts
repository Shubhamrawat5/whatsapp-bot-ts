import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const text = `DON'T ASK TO ASK!! \n\nhttps://dontasktoask.com/`;

  await reply(text);
};

const ask = () => {
  const cmd = ["ask"];

  return { cmd, handler };
};

export default ask;
