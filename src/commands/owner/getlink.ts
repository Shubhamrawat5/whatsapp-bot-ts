import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getGroupData } from "../../db/pvxGroupDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const getGroupLinkRes = await getGroupData();
  let message = "📛 PVX LINKS 📛";
  getGroupLinkRes.forEach((group) => {
    message += `\n\n${group.groupjid}\n${group.gname}\n${group.link}`;
  });

  await reply(message);
};

const getlink = () => {
  const cmd = ["getlink"];

  return { cmd, handler };
};

export default getlink;
