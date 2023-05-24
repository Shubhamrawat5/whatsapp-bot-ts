const {
  getCountIndividualAllGroupWithName,
} = require("../../db/countMemberDB");

import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

export const command = () => {
  let cmd = ["count", "total"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { sender, args, from } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  if (args[0]) {
    sender = args[0] + "@s.whatsapp.net";
  }
  if (msg.message?.extendedTextMessage?.contextInfo) {
    if (msg.message.extendedTextMessage.contextInfo.participant)
      sender = msg.message.extendedTextMessage.contextInfo.participant;
    else if (msg.message.extendedTextMessage.contextInfo.mentionedJid)
      sender = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
  }

  let resultCountGroup = await getCountIndividualAllGroupWithName(sender);

  let username: string = resultCountGroup.length
    ? resultCountGroup[0].name
    : sender.split("@")[0];

  let countGroupMsg = `*📛 ${username} PVX STATS 📛*\n_From 24 Nov 2021_${readMore}\n`;
  let countGroupMsgTemp = "\n";
  let totalGrpCount = 0;
  for (let group of resultCountGroup) {
    let grpName = group.gname;
    grpName = grpName.replace("<{PVX}> ", "");
    totalGrpCount += Number(group.count);
    countGroupMsgTemp += `\n${group.count} - ${grpName}`;
  }
  countGroupMsg += `\n*TotaL Messages: ${totalGrpCount}*`;
  countGroupMsg += countGroupMsgTemp;

  await bot.sendMessage(
    from,
    {
      text: countGroupMsg,
    },
    { quoted: msg }
  );
};
