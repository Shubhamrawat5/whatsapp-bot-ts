import { ParticipantAction } from "@adiwajshing/baileys";
import addMemberCheck from "./functions/addMemberCheck";
import { Bot } from "./interface/Bot";
import { getUsernames } from "./db/membersDB";
import {
  myNumber,
  myNumberWithJid,
  pvxgroups,
  stats,
} from "./constants/constants";
import { LoggerBot } from "./functions/loggerBot";
import { cache } from "./utils/cache";

export interface GroupParticipantUpdate {
  id: string;
  participants: string[];
  action: ParticipantAction;
}

export const groupParticipantsUpdate = async (
  msg: GroupParticipantUpdate,
  bot: Bot,
  botNumberJid: string
) => {
  console.log("[group-participants.update]");
  try {
    const from = msg.id;
    const numJid = msg.participants[0];

    const numSplit = `${numJid.split("@s.whatsapp.net")[0]}`;
    if (numJid === botNumberJid && msg.action === "remove") {
      // bot is removed
      await bot.sendMessage(myNumberWithJid, {
        text: `Bot is removed from group.`,
      });
      return;
    }

    cache.del(`${from}:groupMetadata`);
    const groupMetadata = await bot.groupMetadata(from);
    const groupSubject = groupMetadata.subject;

    if (msg.action === "add") {
      await addMemberCheck(
        bot,
        from,
        numSplit,
        numJid,
        groupSubject,
        pvxgroups,
        myNumber
      );
      const text = `${groupSubject} [ADD] ${numSplit}`;
      await bot.sendMessage(myNumberWithJid, { text });
      console.log(text);
      stats.memberJoined += 1;
    } else if (msg.action === "remove") {
      const text = `${groupSubject} [REMOVE] ${numSplit}`;
      await bot.sendMessage(myNumberWithJid, { text });
      console.log(text);
      stats.memberLeft += 1;
    } else if (
      (msg.action === "promote" || msg.action === "demote") &&
      groupSubject.startsWith("<{PVX}>")
    ) {
      // promote, demote
      const getUsernamesRes = await getUsernames([numJid]);
      const username = getUsernamesRes.length
        ? getUsernamesRes[0].name
        : numSplit;
      const action =
        msg.action === "promote" ? "Promoted to Admin" : "Demoted to Member";
      const text = `*ADMIN CHANGE ALERT!!*\n\nUser: ${username}\nGroup: ${groupSubject}\nAction: ${action}`;
      await bot.sendMessage(pvxgroups.pvxadmin, { text });
      await bot.sendMessage(pvxgroups.pvxsubadmin, { text });
    }
  } catch (err) {
    await LoggerBot(bot, "group-participants.update", err, msg);
  }
};
