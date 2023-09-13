import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCountIndividualAllGroup } from "../../db/countMemberDB";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { args, from, sender } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  let participant: string;

  if (args.length) {
    participant = `${args.join("").replace(/ |-|\(|\)/g, "")}@s.whatsapp.net`;
  } else if (msg.message?.extendedTextMessage) {
    participant = await getMentionedOrTaggedParticipant(msg);
  } else {
    participant = sender;
  }

  if (participant.startsWith("+") || participant.startsWith("@")) {
    participant = participant.slice(1);
  }
  if (participant.length === 10 + 15) {
    participant = `91${participant}`;
  }

  const getCountIndividualAllGroupRes = await getCountIndividualAllGroup(
    participant
  );

  const username: string = getCountIndividualAllGroupRes.length
    ? getCountIndividualAllGroupRes[0].name
    : participant.split("@")[0];

  let countGroupMsg = `*📛 ${username} PVX STATS 📛*\n_From 24 Nov 2021_${readMore}\n`;
  let countGroupMsgTemp = "\n";
  let totalGrpCount = 0;
  getCountIndividualAllGroupRes.forEach((group) => {
    let grpName = group.gname;
    grpName = grpName.replace("<{PVX}> ", "");
    totalGrpCount += Number(group.message_count);
    countGroupMsgTemp += `\n${group.message_count} - ${grpName}`;
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
