import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

const { getCountGroupMembers } = require("../../db/countMemberDB");

export const command = () => {
  let cmd = ["zero"];

  return { cmd, handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { groupName, groupMembers, reply, from } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  let resultCountGroupIndi = await getCountGroupMembers(from);

  let memWithMsg = new Set();
  for (let member of resultCountGroupIndi) {
    memWithMsg.add(member.memberjid);
  }

  let zeroMsg = `${groupName}\nMembers with 0 message from 24 NOV:${readMore}\n`;

  groupMembers?.forEach((mem) => {
    if (!memWithMsg.has(mem.id)) {
      zeroMsg += `\n${mem.id.split("@")[0]}`;
    }
  });

  await reply(zeroMsg);
};
