import { WAMessage } from "@whiskeysockets/baileys";
import { pvxgroups } from "../../utils/constants";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCountVideo } from "../../db/countMemberDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupMembers, reply, from } = msgInfoObj;

  const { pvxmano } = pvxgroups;
  if (from !== pvxmano) {
    await reply("❌ Only Mano Group command!");
    return;
  }
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  const getCountVideoRes = await getCountVideo(pvxmano);
  let countGroupMsgIndi = `*📛 MANO VIDEO COUNT*\n_From 6 JUNE 2022_${readMore}\n`;
  const memWithMsg = new Set();
  getCountVideoRes.forEach((member) => {
    memWithMsg.add(member.memberjid);
  });

  let countGroupMsgTempIndi = "\n";
  let totalGrpCountIndi = 0;
  getCountVideoRes.forEach((member) => {
    totalGrpCountIndi += member.video_count;
    countGroupMsgTempIndi += `\n${member.video_count} - ${member.name}`;
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

const pvxv = () => {
  const cmd = ["pvxv"];

  return { cmd, handler };
};

export default pvxv;
