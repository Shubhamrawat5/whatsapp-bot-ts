import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

export const command = () => {
  let cmd = ["link", "pvx", "pvxlink"];

  return { cmd, handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { from } = msgInfoObj;

  let text =
    "*─「 🔥 JOIN <{PVX}> FAMILY 🔥 」─*\n\n>> https://pvxcommunity.com <<";

  await bot.sendMessage(from, { text }, { quoted: msg, detectLinks: true });
};
