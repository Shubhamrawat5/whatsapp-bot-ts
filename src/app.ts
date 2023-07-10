/* ------------------------------ add packages ------------------------------ */
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
  makeInMemoryStore,
} from "@adiwajshing/baileys";

import { Boom } from "@hapi/boom";
import pino from "pino";
import fs from "fs";

/* ----------------------------- add local files ---------------------------- */
import { storeAuth, fetchAuth, deleteAuth } from "./db/authDB";

import { LoggerBot, LoggerTg } from "./functions/loggerBot";

import addCommands from "./functions/addCommands";
import addDefaultMilestones, {
  Milestones,
} from "./functions/addDefaultMilestone";

import {
  pvx,
  myNumberWithJid,
  pvxgroups,
  stats,
  useStore,
} from "./constants/constants";

import { Bot } from "./interface/Bot";

import pvxFunctions from "./functions/pvxFunctions";
import {
  groupParticipantsUpdate,
  GroupParticipantUpdate,
} from "./groupParticipantsUpdate";
import { cache, msgRetryCounterCache } from "./utils/cache";
import { messagesUpsert, MessageUpsert } from "./messagesUpsert";
import { groupsUpsert, GroupsUpsert } from "./groupsUpsert";
import { GroupsUpdate, groupsUpdate } from "./groupsUpdate";

stats.started = new Date().toLocaleString("en-GB", {
  timeZone: "Asia/kolkata",
});

let startCount = 1;
let dateCheckerInterval: NodeJS.Timeout;

let milestones: Milestones = {};

const silentLogs = pino({ level: "silent" }); // to hide the chat logs
// let debugLogs = pino({ level: "debug" });

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = useStore ? makeInMemoryStore({ logger: silentLogs }) : undefined;
if (store) {
  store.readFromFile("./baileys_store_multi");
  setInterval(() => {
    store.writeToFile("./baileys_store_multi");
  }, 10_000);
}

// try {
//   fs.rmSync("./auth_info_multi", { recursive: true, force: true });
//   console.log("Local auth_info_multi file deleted.");
//   // fs.unlinkSync("./auth_info_multi.json");
// } catch (err) {
//   console.log("Local auth_info_multi file already deleted.");
// }

const startBot = async () => {
  console.log(`[STARTING BOT]: ${startCount}`);
  await LoggerTg(`[STARTING BOT]: ${startCount}`);
  try {
    const { state, saveCreds } = await useMultiFileAuthState(
      "./auth_info_multi"
    );

    const {
      commandsPublic,
      commandsMembers,
      commandsAdmins,
      commandsOwners,
      allCommandsName,
    } = await addCommands();
    clearInterval(dateCheckerInterval);

    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

    // Fetch login auth
    const { cred, authRowCount } = await fetchAuth(state);
    if (authRowCount !== 0) {
      state.creds = cred.creds;
    }

    const bot: Bot = makeWASocket({
      version,
      logger: silentLogs,
      printQRInTerminal: true,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, silentLogs),
      },
      msgRetryCounterCache,
      generateHighQualityLinkPreview: true,
      shouldIgnoreJid: (jid: string) => isJidBroadcast(jid),
    });

    store?.bind(bot.ev);

    if (pvx === "true") {
      dateCheckerInterval = await pvxFunctions(bot);
    }

    let botNumberJid = bot.user ? bot.user.id : ""; // '1506xxxxx54:3@s.whatsapp.net'
    botNumberJid =
      botNumberJid.slice(0, botNumberJid.search(":")) +
      botNumberJid.slice(botNumberJid.search("@"));

    bot.ev.on("groups.upsert", async (msg: GroupsUpsert) => {
      // new group added
      await groupsUpsert(msg, bot);
    });

    bot.ev.on("groups.update", async (msg: GroupsUpdate) => {
      // subject change, etc
      await groupsUpdate(msg, bot);
    });

    /* ------------------------ group-participants.update ----------------------- */
    bot.ev.on(
      "group-participants.update",
      async (msg: GroupParticipantUpdate) => {
        // participant add, remove, promote, demote
        await groupParticipantsUpdate(msg, bot, botNumberJid);
      }
    );

    bot.ev.on("messages.upsert", async (msgs: MessageUpsert) => {
      // new message
      await messagesUpsert(
        msgs,
        bot,
        botNumberJid,
        commandsPublic,
        commandsMembers,
        commandsAdmins,
        commandsOwners,
        allCommandsName,
        milestones
      );
    });

    bot.ev.on("connection.update", async (update) => {
      try {
        await LoggerTg(`connection.update: ${JSON.stringify(update)}`);
        const { connection, lastDisconnect } = update;
        if (connection === "open") {
          console.log("Connected");
          await bot.sendMessage(myNumberWithJid, {
            text: `[BOT STARTED] - ${startCount}`,
          });
          milestones = await addDefaultMilestones(bot, pvxgroups);

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
        } else if (connection === "close") {
          console.log("connection update", update);

          // reconnect if not logged out
          if (!lastDisconnect) return;
          const shouldReconnect =
            (lastDisconnect.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;
          if (shouldReconnect) {
            await LoggerBot(
              undefined,
              "CONNECTION-CLOSED",
              lastDisconnect.error,
              update
            );
            startCount += 1;

            console.log("[CONNECTION-CLOSED]: Restarting bot in 20 seconds!");
            setTimeout(async () => {
              await startBot();
            }, 1000 * 20);
          } else {
            await LoggerTg(
              `[CONNECTION-CLOSED]: You are logged out\nRestarting in 5 sec to scan new QR code!`
            );
            await deleteAuth();
            try {
              fs.rmSync("./auth_info_multi", { recursive: true, force: true });
              console.log("Local auth_info_multi file deleted.");
              // fs.unlinkSync("./auth_info_multi.json");
            } catch (err) {
              console.log("Local auth_info_multi file already deleted.");
            }
            console.log(
              "[CONNECTION-CLOSED]: You are logged out\nRestarting in 5 sec to scan new QR code!"
            );
            setTimeout(async () => {
              await startBot();
            }, 1000 * 5);
          }
        }
      } catch (err) {
        await LoggerBot(undefined, "connection.update", err, update);
      }
    });

    // listen for when the auth credentials is updated
    bot.ev.on("creds.update", async () => {
      try {
        await saveCreds();
        await storeAuth(state);
      } catch (err) {
        await LoggerBot(bot, "creds.update", err, undefined);
      }
    });
    return bot;
  } catch (err) {
    await LoggerBot(undefined, "BOT-ERROR", err, "");
  }
  return false;
};

export default startBot;
