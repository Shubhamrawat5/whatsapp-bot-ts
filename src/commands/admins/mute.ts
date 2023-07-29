import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from } = msgInfoObj;

  await bot.groupSettingUpdate(from, "announcement");
};

const mute = () => {
  const cmd = ["mute"];

  return { cmd, handler };
};

export default mute;
