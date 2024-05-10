import { ParticipantAction } from "@whiskeysockets/baileys";
import addMemberCheck from "./functions/addMemberCheck";
import { Bot } from "./interfaces/Bot";
import { getUsernames } from "./db/membersDB";
import { pvxgroups, stats } from "./utils/constants";
import { loggerBot, sendLogToOwner } from "./utils/logger";
import { cache } from "./utils/cache";
import { pvxFunctionsEnabled } from "./utils/config";

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
    msg.participants.forEach(async (numJid) => {
      const numSplit = `${numJid.split("@s.whatsapp.net")[0]}`;
      if (numJid === botNumberJid && msg.action === "remove") {
        // bot is removed
        await sendLogToOwner(bot, `Bot is removed from group.`);
        return;
      }

      cache.del(`${from}:groupMetadata`);
      const groupMetadata = await bot.groupMetadata(from);
      const groupSubject = groupMetadata.subject;

      if (msg.action === "add") {
        await addMemberCheck(bot, from, numSplit, numJid, groupSubject);

        const text = `${groupSubject} [ADD] ${numSplit}`;
        await sendLogToOwner(bot, text);

        console.log(text);
        stats.memberJoined += 1;
      } else if (msg.action === "remove") {
        const text = `${groupSubject} [REMOVE] ${numSplit}`;
        await sendLogToOwner(bot, text);

        console.log(text);
        stats.memberLeft += 1;
      } else if (
        (msg.action === "promote" || msg.action === "demote") &&
        pvxFunctionsEnabled === "true" &&
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
        // await bot.sendMessage(pvxgroups.pvxadmin, { text });
        await bot.sendMessage(pvxgroups.pvxsubadmin, { text });
      }
    });
  } catch (err) {
    await loggerBot(bot, "group-participants.update", err, msg);
  }
};
