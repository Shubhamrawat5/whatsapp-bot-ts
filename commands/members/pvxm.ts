import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountGroupMembers } from "../../db/countMemberDB";

export const command = () => {
  const cmd = ["pvxm"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupName, groupMembers, reply, from } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  const resultCountGroupIndi = await getCountGroupMembers(from);

  const memWithMsg = new Set();
  for (const member of resultCountGroupIndi) {
    memWithMsg.add(member.memberjid);
  }

  let countGroupMsgIndi = `*${groupName}*\n_From 24 Nov 2021_${readMore}\n`;

  let countGroupMsgTempIndi = "\n";
  let totalGrpCountIndi = 0;
  for (const member of resultCountGroupIndi) {
    totalGrpCountIndi += member.count;
    countGroupMsgTempIndi += `\n${member.count} - ${member.name}`;
  }

  groupMembers?.forEach((mem) => {
    if (!memWithMsg.has(mem.id)) {
      const username = mem.id.split("@")[0];
      countGroupMsgTempIndi += `\n${0} - ${username}`;
    }
  });

  countGroupMsgIndi += `\n*Total Messages: ${totalGrpCountIndi}*`;
  countGroupMsgIndi += countGroupMsgTempIndi;

  await reply(countGroupMsgIndi);
};
