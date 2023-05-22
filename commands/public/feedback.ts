import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

export const command = () => {
  let cmd = ["feedback"];

  return { cmd, handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  let text = `✔ Give any Feedback related to PVX\nhttps://forms.gle/WEQ33xzHpYAQvArd6`;

  await reply(text);
};
