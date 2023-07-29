import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { clearCountWarning } from "../../db/warningDB";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, from } = msgInfoObj;

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag or mention someone!");
    return;
  }

  const participant = await getMentionedOrTaggedParticipant(msg);

  const clearCountWarningRes = await clearCountWarning(participant, from);
  if (clearCountWarningRes) {
    const numSplit = participant && participant.split("@s.whatsapp.net")[0];
    const warnMsg = `@${numSplit} ,Your warnings have been cleared for this group!`;

    await bot.sendMessage(from, {
      text: warnMsg,
      mentions: [participant],
    });
  } else {
    await reply(`❌ There is some problem!`);
  }
};

const warnclear = () => {
  const cmd = ["warnclear", "clearwarn", "warningclear", "clearwarning"];

  return { cmd, handler };
};

export default warnclear;
