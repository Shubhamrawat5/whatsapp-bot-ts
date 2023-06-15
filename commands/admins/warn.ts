import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountWarning, setCountWarning } from "../../db/warningDB";
import { getMentionedOrTaggedParticipant } from "../../functions/getParticipant";

export const warn = () => {
  const cmd = ["warn", "warning"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupAdmins, isBotGroupAdmins, reply, from } = msgInfoObj;

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag or mention someone!");
    return;
  }

  const participant = await getMentionedOrTaggedParticipant(msg);

  if (!participant) return;
  const getCountWarningRes = await getCountWarning(participant, from);
  let warnCount = getCountWarningRes.length ? getCountWarningRes[0].count : 0;
  const numSplit = participant.split("@s.whatsapp.net")[0];

  if (warnCount < 3) {
    // 0,1,2
    const setCountWarningRes = await setCountWarning(participant, from);
    if (setCountWarningRes) warnCount += 1;
  }
  const warnMsg = `@${numSplit} ,You have been warned. Warning status: (${warnCount}/3). Don't repeat this type of behaviour again or you'll be banned from the group!`;

  await bot.sendMessage(from, {
    text: warnMsg,
    mentions: [participant],
  });
  if (warnCount >= 3) {
    // on 3rd warning
    if (!isBotGroupAdmins) {
      await reply("❌ I'm not Admin here!");

      return;
    }
    if (groupAdmins.includes(participant)) {
      await reply("❌ Cannot remove admin!");

      return;
    }
    await bot.groupParticipantsUpdate(from, [participant], "remove");
    await reply("_✔ Number removed from group!_");
  }
};
