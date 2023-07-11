import { ConnectionState, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import fs from "fs";
import { cache } from "./utils/cache";
import { deleteAuth } from "./db/authDB";
import { Bot } from "./interface/Bot";
import { LoggerBot, LoggerTg } from "./functions/loggerBot";
import { myNumberWithJid } from "./constants/constants";

let startCount = 1;

export type ConnectionUpdate = Partial<ConnectionState>;

// return true for alright, false for to restart bot
export const connectionUpdate = async (
  update: ConnectionUpdate,
  bot: Bot
): Promise<boolean> => {
  try {
    await LoggerTg(`connection.update: ${JSON.stringify(update)}`);
    const { connection, lastDisconnect } = update;

    // 'open' | 'connecting' | 'close'
    if (connection === "open") {
      console.log("Connected");
      // await LoggerTg(`[STARTED BOT]: ${startCount}`);
      await bot.sendMessage(myNumberWithJid, {
        text: `[BOT STARTED] - ${startCount}`,
      });

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

      groups.forEach((group) => {
        console.log("SET metadata for: ", group.subject);
        cache.set(`${group.id}:groupMetadata`, group, 60 * 60 * 24); // 24 hours
      });

      return true;
    }

    if (connection === "close") {
      console.log("connection update", update);

      // reconnect if not logged out
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      if (shouldReconnect) {
        await LoggerBot(
          undefined,
          "CONNECTION-CLOSED",
          lastDisconnect?.error,
          update
        );
        startCount += 1;

        console.log("[CONNECTION-CLOSED]: Restarting bot in 15 seconds!");
      } else {
        try {
          fs.rmSync("./auth_info_multi", { recursive: true, force: true });
          console.log("Local auth_info_multi file deleted.");
          // fs.unlinkSync("./auth_info_multi.json");
        } catch (err) {
          console.log("Local auth_info_multi file already deleted.");
        }

        await LoggerTg(
          `[CONNECTION-CLOSED]: You are logged out\nRestarting in 15 sec to scan new QR code!`
        );
        await deleteAuth();

        console.log(
          "[CONNECTION-CLOSED]: You are logged out\nRestarting in 15 sec to scan new QR code!"
        );
      }
      return false;
    }
  } catch (err) {
    await LoggerBot(undefined, "connection.update", err, update);
  }

  return true;
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
