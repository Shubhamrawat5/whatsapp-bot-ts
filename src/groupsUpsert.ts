import { GroupMetadata } from "@adiwajshing/baileys";
import { cache } from "./utils/cache";
import { myNumberWithJid, prefix } from "./constants/constants";
import { LoggerBot } from "./functions/loggerBot";
import { Bot } from "./interface/Bot";

export type GroupsUpsert = GroupMetadata[];

export const groupsUpsert = async (msg: GroupsUpsert, bot: Bot) => {
  try {
    console.log("[groups.upsert]");
    const from = msg[0].id;
    cache.del(`${from}:groupMetadata`);

    await bot.sendMessage(from, {
      text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nSEND ${prefix}help FOR BOT COMMANDS`,
    });
    await bot.sendMessage(myNumberWithJid, {
      text: `Bot is added to group.`,
    });
  } catch (err) {
    await LoggerBot(bot, "groups.upsert", err, msg);
  }
};
