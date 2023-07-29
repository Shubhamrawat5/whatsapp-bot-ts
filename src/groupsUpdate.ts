import { GroupMetadata } from "@whiskeysockets/baileys";
import { loggerBot } from "./utils/logger";
import { Bot } from "./interfaces/Bot";
import { cache } from "./utils/cache";

// TODO: CHECK PARTIAL
export type GroupsUpdate = Partial<GroupMetadata>[];

export const groupsUpdate = async (msgs: GroupsUpdate, bot: Bot) => {
  try {
    console.log("[groups.update]");
    msgs.forEach((msg) => {
      const from = msg.id;
      cache.del(`${from}:groupMetadata`);
    });
  } catch (err) {
    await loggerBot(bot, "groups.update", err, msgs);
  }
};
