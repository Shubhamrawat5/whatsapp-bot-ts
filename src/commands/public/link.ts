import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from } = msgInfoObj;

  const text =
    "*─「 🔥 JOIN <{PVX}> FAMILY 🔥 」─*\n\n>> https://pvxcommunity.com <<";

  await bot.sendMessage(from, { text }, { quoted: msg });
};

const link = () => {
  const cmd = ["link", "pvx", "pvxlink"];

  return { cmd, handler };
};

export default link;
