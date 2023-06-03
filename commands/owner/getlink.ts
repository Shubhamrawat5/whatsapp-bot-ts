import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getGroupLink } from "../../db/grouplinksDB";

export const getlink = () => {
  const cmd = ["getlink", "gl"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const getGroupLinkRes = await getGroupLink();
  let message = "📛 PVX LINKS 📛";
  getGroupLinkRes.forEach((group) => {
    message += `\n\n${group.groupjid}\n${group.gname}\n${group.link}`;
  });

  await reply(message);
};
