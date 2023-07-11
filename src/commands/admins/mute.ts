import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from } = msgInfoObj;

  await bot.groupSettingUpdate(from, "announcement");
};

const mute = () => {
  const cmd = ["mute"];

  return { cmd, handler };
};

export default mute;
