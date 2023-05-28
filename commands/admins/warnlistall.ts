import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountWarningAllGroup } from "../../db/warningDB";

export const command = () => {
  const cmd = ["warnlistall", "warninglistall"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  const warnCount = await getCountWarningAllGroup();
  let warnMsg = `*ALL PVX GROUPS*\n_warning status_${readMore}\n`;

  warnCount.forEach((mem) => {
    warnMsg += `\n${mem.count} - ${mem.name}`;
  });

  await reply(warnMsg);
};
