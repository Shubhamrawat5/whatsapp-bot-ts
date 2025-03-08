/* ------------------------------ add packages ------------------------------ */
import makeWASocket, {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
  makeInMemoryStore,
} from "@whiskeysockets/baileys";

// eslint-disable-next-line import/no-extraneous-dependencies
import pino from "pino";
import cron from "node-cron";

/* ----------------------------- add local files ---------------------------- */
import { setAuth, getAuth } from "./db/authDB";
import { loggerBot, loggerTg } from "./utils/logger";
import addCommands from "./functions/addCommands";
import { addDefaultbadges, DefaultBadge } from "./functions/addDefaultBadges";
import { stats, useStore } from "./utils/constants";
import { Bot } from "./interfaces/Bot";
import {
  postBdayCron,
  postNewsCron,
  postNewsListCron,
  postTodayStatsCron,
} from "./functions/pvxFunctions";
import {
  groupParticipantsUpdate,
  GroupParticipantUpdate,
} from "./groupParticipantsUpdate";
import { msgRetryCounterCache } from "./utils/cache";
import { messagesUpsert, MessageUpsert } from "./messagesUpsert";
import { groupsUpsert, GroupsUpsert } from "./groupsUpsert";
import { GroupsUpdate, groupsUpdate } from "./groupsUpdate";
// eslint-disable-next-line import/no-cycle
import { ConnectionUpdate, connectionUpdate } from "./connectionUpdate";
import { getIndianDateTime } from "./functions/getIndianDateTime";
import { cronJobEnabled } from "./utils/config";

stats.started = getIndianDateTime().toDateString();

let bdayCronJob: cron.ScheduledTask | undefined;
let newsCronJob: cron.ScheduledTask | undefined;
let newsListCronJob: cron.ScheduledTask | undefined;
let todayStatsCronJob: cron.ScheduledTask | undefined;

let defaultBadges: DefaultBadge = {};

// const silentLogs = pino({ level: "silent" }); // to hide the chat logs
// let debugLogs = pino({ level: "debug" });
const MAIN_LOGGER = pino({
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
});
const logger = MAIN_LOGGER.child({});
logger.level = "silent";

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = useStore ? makeInMemoryStore({ logger }) : undefined;
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

    bdayCronJob?.stop();
    newsCronJob?.stop();
    newsListCronJob?.stop();
    todayStatsCronJob?.stop();

    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

    // Fetch login auth
    const creds = await getAuth(state);
    if (creds) {
      state.creds = creds;
    }

    const bot: Bot = makeWASocket({
      version,
      logger,
      printQRInTerminal: true,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      msgRetryCounterCache,
      generateHighQualityLinkPreview: true,
      shouldIgnoreJid: (jid: string) => isJidBroadcast(jid),
    });

    store?.bind(bot.ev);

    if (cronJobEnabled === "true") {
      bdayCronJob = await postBdayCron(bot);
      newsCronJob = await postNewsListCron(bot);
      newsListCronJob = await postNewsCron(bot);
      todayStatsCronJob = await postTodayStatsCron(bot);
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
      // subject change, admin only chat, admin can edit subject, etc
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
        defaultBadges
      );
    });

    bot.ev.on("connection.update", async (update: ConnectionUpdate) => {
      const res = await connectionUpdate(update, bot);
      if (update.connection === "open") {
        defaultBadges = await addDefaultbadges(bot);
      }

      if (res !== 0) {
        setTimeout(async () => {
          await startBot();
        }, 1000 * res);
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
