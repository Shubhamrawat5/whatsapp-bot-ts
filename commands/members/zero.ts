import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountGroupMembers } from "../../db/countMemberDB";

export const zero = () => {
  const cmd = ["zero"];

  return { cmd, handler };
};

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

  groupMembers?.forEach((mem) => {
    if (!memWithMsg.has(mem.id)) {
      zeroMsg += `\n${mem.id.split("@")[0]}`;
    }
  });

  await reply(zeroMsg);
};
