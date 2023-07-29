import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCountTop } from "../../db/countMemberDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupName, reply, groupMembers } = msgInfoObj;
  if (!groupMembers) return;

  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  const groupMembersId = groupMembers.map((member) => member.id);

  const getCountTopRes = await getCountTop(10000);

  let countGroupMsgTop = `*${groupName}*\n_MEMBERS RANK_${readMore}\n`;

  getCountTopRes.forEach((member, index) => {
    if (groupMembersId.includes(member.memberjid)) {
      countGroupMsgTop += `\n${index + 1}) ${member.name} - ${
        member.message_count
      }`;
    }
  });

  await reply(countGroupMsgTop);
};

const pvxtm = () => {
  const cmd = ["pvxtm", "pvxmt"];

  return { cmd, handler };
};

export default pvxtm;
