import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { clearCountWarning } from "../../db/warningDB";
import { getMentionedOrTaggedParticipant } from "../../functions/getParticipant";

export const warnclear = () => {
  const cmd = ["warnclear", "clearwarn", "warningclear", "clearwarning"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, from } = msgInfoObj;

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag or mention someone!");
    return;
  }

  const participant = await getMentionedOrTaggedParticipant(msg);

  await clearCountWarning(participant, from);

  const num_split = participant && participant.split("@s.whatsapp.net")[0];
  const warnMsg = `@${num_split} ,Your warnings have been cleared for this group!`;

  await bot.sendMessage(from, {
    text: warnMsg,
    mentions: [participant],
  });
};
