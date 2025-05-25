import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCountWarningAllGroup } from "../../db/warningDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  const getCountWarningAllGroupRes = await getCountWarningAllGroup();
  let warnMsg = `*ALL PVX GROUPS*\n_warning status_${readMore}\n`;

  getCountWarningAllGroupRes.forEach((member) => {
    warnMsg += `\n${member.warning_count} - ${member.name}`;
  });

  await reply(warnMsg);
};

const warnlistall = () => {
  const cmd = ["warnlistall", "warninglistall"];

  return { cmd, handler };
};

export default warnlistall;
