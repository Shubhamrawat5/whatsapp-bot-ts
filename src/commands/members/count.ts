import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountIndividualAllGroup } from "../../db/countMemberDB";
import { getMentionedOrTaggedParticipant } from "../../functions/getParticipant";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { args, from } = msgInfoObj;
  let { sender } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  if (args.length) {
    sender = `${args.join("").replace(/ |-|\(|\)/g, "")}@s.whatsapp.net`;
  } else if (msg.message?.extendedTextMessage) {
    sender = await getMentionedOrTaggedParticipant(msg);
  }

  if (sender.startsWith("+") || sender.startsWith("@")) {
    sender = sender.slice(1);
  }
  if (sender.length === 10 + 15) {
    sender = `91${sender}`;
  }

  const getCountIndividualAllGroupRes = await getCountIndividualAllGroup(
    sender
  );

  const username: string = getCountIndividualAllGroupRes.length
    ? getCountIndividualAllGroupRes[0].name
    : sender.split("@")[0];

  let countGroupMsg = `*📛 ${username} PVX STATS 📛*\n_From 24 Nov 2021_${readMore}\n`;
  let countGroupMsgTemp = "\n";
  let totalGrpCount = 0;
  getCountIndividualAllGroupRes.forEach((group) => {
    let grpName = group.gname;
    grpName = grpName.replace("<{PVX}> ", "");
    totalGrpCount += Number(group.count);
    countGroupMsgTemp += `\n${group.count} - ${grpName}`;
  });

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

const count = () => {
  const cmd = ["count", "total"];

  return { cmd, handler };
};

export default count;
