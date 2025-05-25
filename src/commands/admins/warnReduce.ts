import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import {
  clearCountWarning,
  getCountWarning,
  reduceCountWarning,
} from "../../db/warningDB";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, from } = msgInfoObj;

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag or mention someone!");
    return;
  }

  const participant = await getMentionedOrTaggedParticipant(msg);

  if (!participant) return;
  const getCountWarningRes = await getCountWarning(participant, from);
  let warnCount = getCountWarningRes.length ? getCountWarningRes[0].warning_count : 0;
  const numSplit = participant.split("@s.whatsapp.net")[0];

  if (warnCount === 1) {
    const clearCountWarningRes = await clearCountWarning(participant, from);
    if (clearCountWarningRes) warnCount -= 1;
    else {
      await reply(`❌ There is some problem!`);
      return;
    }
  } else if (warnCount > 1) {
    const reduceCountWarningRes = await reduceCountWarning(participant, from);
    if (reduceCountWarningRes) warnCount -= 1;
    else {
      await reply(`❌ There is some problem!`);
      return;
    }
  }

  const warnMsg = `@${numSplit} ,Your warning have been reduced by 1. Warning status: (${warnCount}/3)`;

  await bot.sendMessage(from, {
    text: warnMsg,
    mentions: [participant],
  });
};

const warnreduce = () => {
  const cmd = [
    "warnreduce",
    "reducewarn",
    "warningreduce",
    "reducewarning",
    "unwarn",
  ];

  return { cmd, handler };
};

export default warnreduce;
