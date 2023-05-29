import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountTop } from "../../db/countMemberDB";

export const pvxtm = () => {
  const cmd = ["pvxtm", "pvxmt"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupName, reply, groupMembers } = msgInfoObj;
  if (!groupMembers) return;

  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  const groupMembersId = groupMembers.map((member) => member.id);

  const resultCountGroupTop = await getCountTop(10000);

  let countGroupMsgTop = `*${groupName}*\n_MEMBERS RANK_${readMore}\n`;

  resultCountGroupTop.forEach((member, index) => {
    if (groupMembersId.includes(member.memberjid))
      countGroupMsgTop += `\n${index + 1}) ${member.name} - ${member.count}`;
  });

  await reply(countGroupMsgTop);
};
