import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const text = `✔ Give any Feedback related to PVX\nhttps://forms.gle/WEQ33xzHpYAQvArd6`;

  await reply(text);
};

const feedback = () => {
  const cmd = ["feedback"];

  return { cmd, handler };
};

export default feedback;
