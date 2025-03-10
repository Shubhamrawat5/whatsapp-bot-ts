import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCountGroupsMonth } from "../../db/countMemberMonthDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  const getCountGroupsRes = await getCountGroupsMonth();
  const today = new Date();
  const monthName = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();

  let countGroupMsg = `*📛 PVX GROUPS STATS 📛*\n_${monthName} ${year}_${readMore}\n`;

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

const pvxgg = () => {
  const cmd = ["pvxgg"];

  return { cmd, handler };
};

export default pvxgg;
