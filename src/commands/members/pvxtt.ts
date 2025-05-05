import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCountTopMonth } from "../../db/countMemberMonthDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { args, reply } = msgInfoObj;

  let noOfResult = 20;
  // get number from args if available
  if (args.length) {
    const no = Number(args[0]);
    // if number is given then
    if (no && no > 0 && no <= 500) {
      noOfResult = no;
    }
  }
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  const getCountTopRes = await getCountTopMonth(noOfResult);
  const today = new Date();
  const monthName = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();

  let countGroupMsgTop = `*📛 PVX TOP ${noOfResult} ADMINS 📛*\n_${monthName} ${year}_${readMore}\n`;

  let countGroupMsgTempTop = "\n";
  let totalGrpCountTop = 0;
  getCountTopRes.forEach((member, index) => {
    totalGrpCountTop += Number(member.message_count);
    countGroupMsgTempTop += `\n${index + 1}) ${member.name} - ${
      member.message_count
    }`;
  });
  countGroupMsgTop += `\n*Total Messages: ${totalGrpCountTop}*`;
  countGroupMsgTop += countGroupMsgTempTop;

  await reply(countGroupMsgTop);
};

const pvxtt = () => {
  const cmd = ["pvxtt"];

  return { cmd, handler };
};

export default pvxtt;
