import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCountGroupMembers } from "../../db/countMemberDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupName, groupMembers, reply, from } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  const getCountGroupMembersRes = await getCountGroupMembers(from);

  const memWithMsg = new Set();
  getCountGroupMembersRes.forEach((member) => {
    memWithMsg.add(member.memberjid);
  });

  let countGroupMsgIndi = `*${groupName}*\n_From 24 Nov 2021_${readMore}\n`;

  let countGroupMsgTempIndi = "\n";
  let totalGrpCountIndi = 0;
  getCountGroupMembersRes.forEach((member) => {
    totalGrpCountIndi += member.message_count;
    countGroupMsgTempIndi += `\n${member.message_count} - ${member.name}`;
  });

  groupMembers?.forEach((member) => {
    if (!memWithMsg.has(member.id)) {
      const username = member.id.split("@")[0];
      countGroupMsgTempIndi += `\n${0} - ${username}`;
    }
  });

  countGroupMsgIndi += `\n*Total Messages: ${totalGrpCountIndi}*`;
  countGroupMsgIndi += countGroupMsgTempIndi;

  await reply(countGroupMsgIndi);
};

const pvxm = () => {
  const cmd = ["pvxm"];

  return { cmd, handler };
};

export default pvxm;
