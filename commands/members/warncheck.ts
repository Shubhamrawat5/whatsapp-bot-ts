import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountWarning } from "../../db/warningDB";

export const warncheck = () => {
  const cmd = ["warncheck", "warncount", "countwarn", "checkwarn"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { sender, reply, args, from } = msgInfoObj;

  if (!msg.message?.extendedTextMessage) {
    if (args.length === 0) {
      //check for user
      const res = await getCountWarning(sender, from);
      const warnCount = res.length ? res[0].count : 0;
      const warnMsg = `Your warning count is ${warnCount} for this group!`;
      await reply(warnMsg);
    } else {
      await reply("❌ Tag someone!");
    }
    return;
  }

  const mentioned = msg.message.extendedTextMessage.contextInfo?.mentionedJid;
  if (mentioned && mentioned.length) {
    //when member are mentioned with command
    if (mentioned.length === 1) {
      const res = await getCountWarning(mentioned[0], from);
      const warnCount = res.length ? res[0].count : 0;
      const num_split = mentioned[0].split("@s.whatsapp.net")[0];
      const warnMsg = `@${num_split} ,Your warning count is ${warnCount} for this group!`;

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
    const res = await getCountWarning(taggedMessageUser[0], from);
    const warnCount = res.length ? res[0].count : 0;
    const num_split = participant && participant.split("@s.whatsapp.net")[0];
    const warnMsg = `@${num_split} ,Your warning count is ${warnCount} for this group!`;

    await bot.sendMessage(from, {
      text: warnMsg,
      mentions: taggedMessageUser,
    });
  }
};
