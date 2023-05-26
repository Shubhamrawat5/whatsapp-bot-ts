import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountTop } from "../../db/countMemberDB";

export const command = () => {
  let cmd = ["pvxt"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { args, reply } = msgInfoObj;

  let noOfResult = 20;
  //get number from args if available
  if (args.length) {
    let no = Number(args[0]);
    //if number is given then
    if (no && no > 0 && no <= 500) {
      noOfResult = no;
    }
  }
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  let resultCountGroupTop = await getCountTop(noOfResult);
  let countGroupMsgTop = `*📛 PVX TOP ${noOfResult} MEMBERS 📛*\n_From 24 Nov 2021_${readMore}\n`;

  let countGroupMsgTempTop = "\n";
  let totalGrpCountTop = 0;
  resultCountGroupTop.forEach((member: any, index: number) => {
    totalGrpCountTop += Number(member.count);
    countGroupMsgTempTop += `\n${index + 1}) ${member.name} - ${member.count}`;
  });
  countGroupMsgTop += `\n*Total Messages: ${totalGrpCountTop}*`;
  countGroupMsgTop += countGroupMsgTempTop;

  await reply(countGroupMsgTop);
};
