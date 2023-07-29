import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCountTop5 } from "../../db/countMemberDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  const getCountTop5Res = await getCountTop5();
  let countGroupMsgTop5 = `*📛 PVX TOP 5 MEMBERS FROM ALL GROUPS 📛*\n_From 24 Nov 2021_${readMore}\n`;

  let lastGroupName = getCountTop5Res.length ? getCountTop5Res[0].gname : "";
  let countGroupMsgTempTop5 = `\n\n📛 ${lastGroupName}`;
  getCountTop5Res.forEach((member) => {
    if (member.gname !== lastGroupName) {
      lastGroupName = member.gname;
      countGroupMsgTempTop5 += `\n\n📛 *${lastGroupName}*`;
    }
    countGroupMsgTempTop5 += `\n${member.message_count} - ${member.name}`;
  });

  countGroupMsgTop5 += countGroupMsgTempTop5;

  await reply(countGroupMsgTop5);
};

const pvxt5 = () => {
  const cmd = ["pvxt5"];

  return { cmd, handler };
};

export default pvxt5;
