import { GroupMetadata } from "@whiskeysockets/baileys";
import { LoggerBot } from "./functions/loggerBot";
import { Bot } from "./interface/Bot";
import { cache } from "./utils/cache";

// TODO: CHECK PARTIAL
export type GroupsUpdate = Partial<GroupMetadata>[];

export const groupsUpdate = async (msg: GroupsUpdate, bot: Bot) => {
  try {
    console.log("[groups.update]");
    const from = msg[0].id;
    cache.del(`${from}:groupMetadata`);
  } catch (err) {
    await LoggerBot(bot, "groups.update", err, msg);
  }
};
