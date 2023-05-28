import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { clearCountWarning } from "../../db/warningDB";

export const command = () => {
  const cmd = ["warnclear", "clearwarn", "warningclear", "clearwarning"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, from } = msgInfoObj;

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag someone!");
    return;
  }
  const mentioned = msg.message.extendedTextMessage.contextInfo?.mentionedJid;
  if (mentioned && mentioned.length) {
    //when member are mentioned with command
    if (mentioned.length === 1) {
      const num_split = mentioned[0].split("@s.whatsapp.net")[0];
      await clearCountWarning(mentioned[0], from);
      const warnMsg = `@${num_split} ,Your warnings have been cleared for this group!`;

      await bot.sendMessage(from, {
        text: warnMsg,
        mentions: mentioned,
      });
    } else {
      //if multiple members are tagged
      await reply("❌ Mention only 1 member!");
    }
  } else {
    //when message is tagged with command
    const participant =
      msg.message.extendedTextMessage.contextInfo?.participant;
    if (!participant) return;
    const taggedMessageUser = [participant];

    const num_split = participant && participant.split("@s.whatsapp.net")[0];
    await clearCountWarning(taggedMessageUser[0], from);
    const warnMsg = `@${num_split} ,Your warnings have been cleared for this group!`;
    await bot.sendMessage(from, {
      text: warnMsg,
      mentions: taggedMessageUser,
    });
  }
};
