import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getGroupLink } from "../../db/grouplinksDB";

export const command = () => {
  let cmd = ["getlink", "gl"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { reply } = msgInfoObj;

  const res = await getGroupLink();
  let message = "📛 PVX LINKS 📛";
  res.forEach((group) => {
    message += `\n\n${group.groupjid}\n${group.gname}\n${group.link}`;
  });

  reply(message);
};
