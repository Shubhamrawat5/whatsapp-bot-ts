import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountWarningAll } from "../../db/warningDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, groupName, from } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  const getCountWarningAllRes = await getCountWarningAll(from);
  let warnMsg = `*${groupName}*\n_warning status_${readMore}\n`;

  getCountWarningAllRes.forEach((mem) => {
    warnMsg += `\n${mem.count} - ${mem.name}`;
  });

  await reply(warnMsg);
};

const warnlist = () => {
  const cmd = ["warnlist", "warninglist"];

  return { cmd, handler };
};

export default warnlist;
