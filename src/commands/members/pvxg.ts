import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCountGroups } from "../../db/countMemberDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  const getCountGroupsRes = await getCountGroups();
  let countGroupMsg = `*📛 PVX GROUPS STATS 📛*\n_From 24 Nov 2021_${readMore}\n`;

  let countGroupMsgTemp = "\n";
  let totalGrpCount = 0;
  getCountGroupsRes.forEach((group) => {
    let grpName = group.gname ?? "Not Found";
    if (grpName.toUpperCase().includes("<{PVX}>")) {
      // grpName = grpName.split(" ")[1];
      grpName = grpName.replace("<{PVX}> ", "");
      totalGrpCount += Number(group.message_count);
      countGroupMsgTemp += `\n${group.message_count} - ${grpName}`;
    }
  });

  countGroupMsg += `\n*Total Messages: ${totalGrpCount}*`;
  countGroupMsg += countGroupMsgTemp;
  await reply(countGroupMsg);
};

const pvxg = () => {
  const cmd = ["pvxg"];

  return { cmd, handler };
};

export default pvxg;
