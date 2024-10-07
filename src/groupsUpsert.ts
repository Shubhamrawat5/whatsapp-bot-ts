import { GroupMetadata } from "@whiskeysockets/baileys";
import { cache } from "./utils/cache";
// import { prefix } from "./utils/constants";
import { loggerBot, sendLogToOwner } from "./utils/logger";
import { Bot } from "./interfaces/Bot";

export type GroupsUpsert = GroupMetadata[];

export const groupsUpsert = async (msgs: GroupsUpsert, bot: Bot) => {
  try {
    console.log("[groups.upsert]");
    msgs.forEach(async (msg) => {
      const from = msg.id;
      cache.del(`${from}:groupMetadata`);

      // await bot.sendMessage(from, {
      //   text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nSEND ${prefix}help FOR BOT COMMANDS`,
      // });

      await sendLogToOwner(bot, `Bot is added to new group.`);
    });
  } catch (err) {
    await loggerBot(bot, "groups.upsert", err, msgs);
  }
};
