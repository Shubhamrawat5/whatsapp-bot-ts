import { GroupMetadata } from "@whiskeysockets/baileys";
import { loggerBot } from "./utils/logger";
import { Bot } from "./interfaces/Bot";
import { cache } from "./utils/cache";

export type GroupsUpdate = Partial<GroupMetadata>[];

export const groupsUpdate = async (msgs: GroupsUpdate, bot: Bot) => {
  try {
    console.log("[groups.update]");

    if (msgs.length === 1) {
      const from = msgs[0].id;
      cache.del(`${from}:groupMetadata`);
    }

    // console.log(msgs.length); // TODO: CHECK - GETTING CALL FOR ALL THE GROUPS AT BEGINNING
    // DESCRIPTION CHANGE IS NOT GETTING HERE

    // msgs.forEach((msg) => {
    //   const from = msg.id;
    //   cache.del(`${from}:groupMetadata`);
    // });
  } catch (err) {
    await loggerBot(bot, "groups.update", err, msgs);
  }
};
