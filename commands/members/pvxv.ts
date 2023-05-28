import { pvxgroups } from "../../constants/constants";
import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountVideo } from "../../db/countVideoDB";

export const command = () => {
  const cmd = ["pvxv"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupMembers, reply, from } = msgInfoObj;

  const { pvxmano } = pvxgroups;
  if (from != pvxmano) {
    await reply("❌ Only Mano Group command!");
    return;
  }
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  const resultCountGroupIndi = await getCountVideo(pvxmano);
  let countGroupMsgIndi = `*📛 MANO VIDEO COUNT*\n_From 6 JUNE 2022_${readMore}\n`;
  const memWithMsg = new Set();
  for (const member of resultCountGroupIndi) {
    memWithMsg.add(member.memberjid);
  }

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
