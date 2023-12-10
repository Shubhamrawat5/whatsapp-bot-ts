import { ConnectionState, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import fs from "fs";
import { cache } from "./utils/cache";
import { deleteAuth } from "./db/authDB";
import { Bot } from "./interfaces/Bot";
import { loggerBot, loggerTg } from "./utils/logger";
import { ownerNumberWithJid } from "./utils/config";

let startCount = 1;

export type ConnectionUpdate = Partial<ConnectionState>;

// return a number (time in second), if 0 then do not restart bot else restart with return time
export const connectionUpdate = async (
  update: ConnectionUpdate,
  bot: Bot
): Promise<number> => {
  try {
    // await loggerTg(`connection.update: ${JSON.stringify(update)}`);
    const { connection, lastDisconnect } = update;

    // 'open' | 'connecting' | 'close'
    if (connection === "open") {
      console.log("Connected");
      // await loggerTg(`[STARTED BOT]: ${startCount}`);

      if (ownerNumberWithJid) {
        await bot.sendMessage(ownerNumberWithJid, {
          text: `[BOT STARTED] - ${startCount}`,
        });
      }

      // SET GROUP META DATA
      const chats = await bot.groupFetchAllParticipating();
      const groups = Object.values(chats)
        .filter((v) => v.id.endsWith("g.us"))
        .map((v) => ({
          subject: v.subject,
          desc: v.desc,
          id: v.id,
          participants: v.participants,
        }));

      groups.forEach(async (group) => {
        console.log(`SET metadata for: ${group.subject} (${group.id})`);
        cache.set(`${group.id}:groupMetadata`, group, 60 * 60 * 24); // 24 hours
        // await setGroupsData(group.id, group.subject, null);
      });

      return 0;
    }

    if (connection === "close") {
      console.log("connection update", update);

      // reconnect if not logged out
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      if (shouldReconnect) {
        // await loggerBot(
        //   undefined,
        //   "CONNECTION-CLOSED",
        //   lastDisconnect?.error,
        //   update
        // );
        await loggerTg(
          `[CONNECTION-CLOSED]: ${lastDisconnect?.error?.toString()} Restarting Bot in 20 sec!`
        );
        startCount += 1;

        return 20;
      }

      // LOGOUT
      await loggerTg(
        `[CONNECTION-CLOSED]: You are logged out\nRestarting in 10 sec to scan new QR code!`
      );
      await deleteAuth();

      try {
        fs.rmSync("./auth_info_multi", { recursive: true, force: true });
        // fs.unlinkSync("./auth_info_multi");
        console.log("Local auth_info_multi file deleted.");
      } catch (err) {
        console.log("Local auth_info_multi file already deleted.");
      }

      return 10;
    }
  } catch (err) {
    await loggerBot(undefined, "connection.update", err, update);
  }

  return 0;
};

// bot.sendMessage(
//   pvxcommunity,
//   {
//     text: `Yes`,
//   },
//   {
//     quoted: {
//       key: {
//         remoteJid: pvxcommunity,
//         fromMe: false,
//         id: "710B5CF29EE7471fakeid",
//         participant: "91967564hkjhk@s.whatsapp.net",
//       },
//       messageTimestamp: 1671784177,
//       pushName: "xyz",
//       message: { conversation: "text" },
//     },
//   }
// );
