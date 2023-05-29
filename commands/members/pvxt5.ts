import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountTop5 } from "../../db/countMemberDB";

export const pvxt5 = () => {
  const cmd = ["pvxt5"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  const resultCountGroupTop5 = await getCountTop5();
  let countGroupMsgTop5 = `*📛 PVX TOP 5 MEMBERS FROM ALL GROUPS 📛*\n_From 24 Nov 2021_${readMore}\n`;

  let lastGroupName = resultCountGroupTop5[0].gname;
  let countGroupMsgTempTop5 = `\n\n📛 ${lastGroupName}`;
  for (const member of resultCountGroupTop5) {
    if (member.gname != lastGroupName) {
      lastGroupName = member.gname;
      countGroupMsgTempTop5 += `\n\n📛 *${lastGroupName}*`;
    }
    countGroupMsgTempTop5 += `\n${member.count} - ${member.name}`;
  }

  countGroupMsgTop5 += countGroupMsgTempTop5;

  await reply(countGroupMsgTop5);
};
