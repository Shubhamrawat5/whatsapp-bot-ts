/* ------------------------------ add packages ------------------------------ */
import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
  makeInMemoryStore,
} from "@whiskeysockets/baileys";

import pino from "pino";

/* ----------------------------- add local files ---------------------------- */
import { setAuth, getAuth } from "./db/authDB";
import { loggerBot, loggerTg } from "./utils/logger";
import addCommands from "./functions/addCommands";
import {
  addDefaultMilestones,
  Milestones,
} from "./functions/addDefaultMilestone";
import { pvx, stats, useStore } from "./constants/constants";
import { Bot } from "./interface/Bot";
import pvxFunctions from "./functions/pvxFunctions";
import {
  groupParticipantsUpdate,
  GroupParticipantUpdate,
} from "./groupParticipantsUpdate";
import { msgRetryCounterCache } from "./utils/cache";
import { messagesUpsert, MessageUpsert } from "./messagesUpsert";
import { groupsUpsert, GroupsUpsert } from "./groupsUpsert";
import { GroupsUpdate, groupsUpdate } from "./groupsUpdate";
import { ConnectionUpdate, connectionUpdate } from "./connection.Update";

stats.started = new Date().toLocaleString("en-GB", {
  timeZone: "Asia/kolkata",
});

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
  console.log(`[STARTING BOT]`);
  await loggerTg(`[STARTING BOT]`);
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
    const { cred, authRowCount } = await getAuth(state);
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

    bot.ev.on("groups.upsert", async (msgs: GroupsUpsert) => {
      // new group added
      await groupsUpsert(msgs, bot);
    });

    bot.ev.on("groups.update", async (msgs: GroupsUpdate) => {
      // subject change, etc
      await groupsUpdate(msgs, bot);
    });

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

    bot.ev.on("connection.update", async (update: ConnectionUpdate) => {
      const res = await connectionUpdate(update, bot);
      if (update.connection === "open") {
        milestones = await addDefaultMilestones(bot);
      }

      if (!res) {
        setTimeout(async () => {
          await startBot();
        }, 1000 * 15);
      }
    });

    bot.ev.on("creds.update", async () => {
      // listen for when the auth credentials is updated
      try {
        await saveCreds();
        await setAuth(state);
      } catch (err) {
        await loggerBot(bot, "creds.update", err, undefined);
      }
    });
    return bot;
  } catch (err) {
    await loggerBot(undefined, "BOT-ERROR", err, "");
  }
  return false;
};

export default startBot;
