import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountWarning } from "../../db/warningDB";
import { getMentionedOrTaggedParticipant } from "../../functions/getParticipant";

export const warncheck = () => {
  const cmd = ["warncheck", "warncount", "countwarn", "checkwarn"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { sender, from } = msgInfoObj;

  let participant: string;

  if (msg.message?.extendedTextMessage) {
    participant = await getMentionedOrTaggedParticipant(msg);
  } else {
    participant = sender;
  }

  const getCountWarningRes = await getCountWarning(participant, from);
  const warnCount = getCountWarningRes.length ? getCountWarningRes[0].count : 0;
  const numSplit = participant.split("@s.whatsapp.net")[0];
  const warnMsg = `@${numSplit} ,Your warning count is ${warnCount} for this group!`;

  await bot.sendMessage(from, {
    text: warnMsg,
    mentions: [participant],
  });
};
