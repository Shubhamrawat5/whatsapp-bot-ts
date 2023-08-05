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

  let zeroMsg = `${groupName}\nMembers with 0 message from 24 NOV:${readMore}\n`;

  groupMembers?.forEach((member) => {
    if (!memWithMsg.has(member.id)) {
      zeroMsg += `\n${member.id.split("@")[0]}`;
    }
  });

  await reply(zeroMsg);
};

const zero = () => {
  const cmd = ["zero"];

  return { cmd, handler };
};

export default zero;
