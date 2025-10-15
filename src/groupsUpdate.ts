import { GroupMetadata } from "@whiskeysockets/baileys";
import { loggerBot } from "./utils/logger";
import { Bot } from "./interfaces/Bot";
import { cache } from "./utils/cache";
import { updateMemberLIDsFromSignal } from "./db/membersDB";
// import { bulkUpdateMemberLids } from "./db/membersDB";

export type GroupsUpdate = Partial<GroupMetadata>[];
let updateIntervalStarted = false;

export const groupsUpdate = async (msgs: GroupsUpdate, bot: Bot) => {
  try {
    console.log("[groups.update]");

    if (msgs.length === 1) {
      const from = msgs[0].id;
      cache.del(`${from}:groupMetadata`);
    }

    if (!updateIntervalStarted) {
      updateIntervalStarted = true;
      console.log("Starting LID update interval...");

      setInterval(async () => {
        await updateMemberLIDsFromSignal(bot);
      }, 1000 * 60 * 1); // every 1 minute
    }

    // console.log(msgs.length); // TODO: CHECK - GETTING CALL FOR ALL THE GROUPS AT BEGINNING
    // DESCRIPTION CHANGE IS NOT GETTING HERE

    // msgs.forEach(async (msg) => {
    //   if (!msg.participants) return;
    //   console.log(
    //     `Group Update: ${msg.subject} (${msg.id}) - Participants: ${msg.participants.length}`
    //   );

    //   // console.log(msg);
    //   const validMembers = msg.participants
    //     .filter((p) => p.phoneNumber && p.id)
    //     .map((p) => ({
    //       jid: p.phoneNumber as string,
    //       lid: p.id as string,
    //     }));

    //   console.log("Valid members for LID update:", validMembers.length);
    //   if (validMembers.length > 0) {
    //     await bulkUpdateMemberLids(validMembers);
    //   }
    // });
  } catch (err) {
    await loggerBot(bot, "groups.update", err, msgs);
  }
};
