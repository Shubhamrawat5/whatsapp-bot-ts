import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import {
  clearCountWarning,
  getCountWarning,
  reduceCountWarning,
} from "../../db/warningDB";
import { getMentionedOrTaggedParticipant } from "../../functions/getParticipant";

export const warnreduce = () => {
  const cmd = ["warnreduce", "reducewarn", "warningreduce", "reducewarning"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, from } = msgInfoObj;

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag or mention someone!");
    return;
  }

  const participant = await getMentionedOrTaggedParticipant(msg);

  if (!participant) return;
  const res = await getCountWarning(participant, from);
  let warnCount = res.length ? res[0].count : 0;
  const num_split = participant.split("@s.whatsapp.net")[0];

  if (warnCount === 1) {
    await clearCountWarning(participant, from);
    warnCount -= 1;
  } else if (warnCount > 1) {
    await reduceCountWarning(participant, from);
    warnCount -= 1;
  }

  const warnMsg = `@${num_split} ,Your warning have been reduced by 1. Warning status: (${warnCount}/3)`;

  await bot.sendMessage(from, {
    text: warnMsg,
    mentions: [participant],
  });
};
