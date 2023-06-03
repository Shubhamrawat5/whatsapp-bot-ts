import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountGroups } from "../../db/countMemberDB";

export const pvxg = () => {
  const cmd = ["pvxg"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  const getCountGroupsRes = await getCountGroups();
  let countGroupMsg = `*📛 PVX GROUP STATS 📛*\n_From 24 Nov 2021_${readMore}\n`;

  let countGroupMsgTemp = "\n";
  let totalGrpCount = 0;
  for (const group of getCountGroupsRes) {
    let grpName = group.gname;
    if (!grpName || !grpName.toUpperCase().includes("<{PVX}>")) continue; //not a pvx group
    // grpName = grpName.split(" ")[1];
    grpName = grpName.replace("<{PVX}> ", "");
    totalGrpCount += Number(group.count);
    countGroupMsgTemp += `\n${group.count} - ${grpName}`;
  }
  countGroupMsg += `\n*Total Messages: ${totalGrpCount}*`;
  countGroupMsg += countGroupMsgTemp;
  await reply(countGroupMsg);
};
