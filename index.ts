/* --------------------------------- SERVER --------------------------------- */
import express, { Express, Request, Response } from "express";
const app: Express = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
const port = process.env.PORT || 80;
app.get("/", (req: Request, res: Response) => {
  // res.send("Bot is running");
  console.log("Get request to /");
  res.sendFile(__dirname + "/index.html");
});

/* -------------------------- delete auth from url -------------------------- */
const { dropAuth } = require("./db/dropauthDB");
// const authHiddenPath = process.env.authHiddenPath; //to have a hidden path for auth db deletion
// app.get("/" + authHiddenPath, async (req, res) => {
//   console.log("Get request to /" + authHiddenPath);
//   let response = await dropAuth();
//   if (response) res.send("Auth DB deleted!");
//   else res.send("There is some error!");
// });

app.listen(port, () => {
  // console.clear();
  console.log("\nWeb-server running!\n");
});

/* ------------------------------ add packages ------------------------------ */
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
  GroupMetadata,
  ParticipantAction,
  WAMessage,
  MessageUpsertType,
  WAMessageKey,
  WAMessageContent,
  proto,
  makeInMemoryStore,
  GroupParticipant,
} from "@adiwajshing/baileys";

import { Boom } from "@hapi/boom";
import pino from "pino";
import fs from "fs";
const stringSimilarity = require("string-similarity");
import NodeCache from "node-cache";
const cache = new NodeCache();
const msgRetryCounterCache = new NodeCache();

let silentLogs = pino({ level: "silent" }); //to hide the chat logs
// let debugLogs = pino({ level: "debug" });

const useStore = false;
// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = useStore ? makeInMemoryStore({ logger: silentLogs }) : undefined;
if (store) {
  store.readFromFile("./baileys_store_multi.json");
  // save every 10s
  setInterval(() => {
    store.writeToFile("./baileys_store_multi.json");
  }, 10_000);
}

// start a connection
// console.log('state : ', state.creds);

/* ----------------------------- add local files ---------------------------- */
const { setCountMember } = require("./db/countMemberDB");
const { setCountVideo } = require("./db/countVideoDB");
const { getDisableCommandData } = require("./db/disableCommandDB");
const { storeAuth, fetchAuth } = require("./db/authDB");
const { addUnknownCmd } = require("./db/addUnknownCmdDB");

const { LoggerBot, LoggerTg } = require("./functions/loggerBot");

import { postTechNews } from "./functions/postTechNews";
import { postStudyInfo } from "./functions/postStudyInfo";
import { checkTodayBday } from "./functions/checkTodayBday";
import { addCommands } from "./functions/addCommands";
import { memberAddCheck } from "./functions/memberAddCheck";
import { addDefaultMilestones } from "./functions/addDefaultMilestone";
import { forwardSticker } from "./functions/forwardSticker";
import { countRemainder } from "./functions/countRemainder";

import { pvxgroups } from "./constants/constants";
import { getGroupData } from "./functions/getGroupData";
import { MsgInfoObj } from "./interface/msgInfoObj";
import { GroupData } from "./interface/GroupData";
import { getGroupAdmins } from "./functions/getGroupAdmins";

require("dotenv").config();
const myNumber = process.env.myNumber;
const myNumberWithJid = myNumber + "@s.whatsapp.net";
const pvx = process.env.pvx;
const isStickerForward = process.env.isStickerForward;

const prefix = "!";

const stats = {
  started: "",
  totalMessages: 0,
  textMessage: 0,
  stickerMessage: 0,
  imageMessage: 0,
  videoMessage: 0,
  documentMessage: 0,
  commandExecuted: 0,
  newsPosted: 0,
  stickerForwarded: 0,
  stickerNotForwarded: 0,
  memberJoined: 0,
  memberLeft: 0,
};
stats.started = new Date().toLocaleString("en-GB", {
  timeZone: "Asia/kolkata",
});

let startCount = 1;
let dateCheckerInterval: NodeJS.Timeout;

let milestones = {};

try {
  fs.rmSync("./auth_info_multi.json", { recursive: true, force: true });
  // fs.unlinkSync("./auth_info_multi.json");
} catch (err) {
  console.log("Local auth file already deleted");
}

const startBot = async () => {
  console.log(`[STARTING BOT]: ${startCount}`);
  LoggerTg(`[STARTING BOT]: ${startCount}`);
  try {
    const { state, saveCreds } = await useMultiFileAuthState(
      "./auth_info_multi.json"
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

    //Fetch login auth
    const { cred, auth_row_count } = await fetchAuth(state);
    if (auth_row_count != 0) {
      state.creds = cred.creds;
    }

    const bot = makeWASocket({
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
      getMessage,
    });

    store?.bind(bot.ev);

    if (pvx === "true") {
      let usedDate = new Date()
        .toLocaleString("en-GB", { timeZone: "Asia/kolkata" })
        .split(",")[0];

      dateCheckerInterval = setInterval(async () => {
        console.log("SET INTERVAL.");
        let todayDate = new Date().toLocaleDateString("en-GB", {
          timeZone: "Asia/kolkata",
        });

        let hour = Number(
          new Date()
            .toLocaleTimeString("en-GB", {
              timeZone: "Asia/kolkata",
            })
            .split(":")[0]
        );
        //8 to 24 ON
        if (hour >= 8) {
          await postTechNews(bot.sendMessage, pvxgroups.pvxtech);
          await postStudyInfo(bot.sendMessage, pvxgroups.pvxstudy);
          ++stats.newsPosted;
        }

        // if (hour % 12 == 0) kickZeroMano(bot, pvxgroups.pvxmano);

        if (usedDate !== todayDate) {
          usedDate = todayDate;
          checkTodayBday(bot, todayDate, pvxgroups.pvxcommunity);
        }
      }, 1000 * 60 * 20); //20 min
    }

    let botNumberJid = bot.user ? bot.user.id : ""; //'1506xxxxx54:3@s.whatsapp.net'
    botNumberJid =
      botNumberJid.slice(0, botNumberJid.search(":")) +
      botNumberJid.slice(botNumberJid.search("@"));

    bot.ev.on("groups.upsert", async (msg: GroupMetadata[]) => {
      //new group added
      try {
        console.log("[groups.upsert]");
        const from = msg[0].id;
        cache.del(from + ":groupMetadata");

        await bot.sendMessage(from, {
          text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nSEND ${prefix}help FOR BOT COMMANDS`,
        });
        bot.sendMessage(myNumberWithJid, {
          text: `Bot is added to group.`,
        });
      } catch (err) {
        await LoggerBot(bot, "groups.upsert", err, msg);
      }
    });

    //TODO: CHECK PARTIAL
    bot.ev.on("groups.update", async (msg: Partial<GroupMetadata>[]) => {
      //subject change, etc
      try {
        console.log("[groups.update]");
        const from = msg[0].id;
        cache.del(from + ":groupMetadata");
      } catch (err) {
        await LoggerBot(bot, "groups.update", err, msg);
      }
    });

    interface GroupParticipantUpdate {
      id: string;
      participants: string[];
      action: ParticipantAction;
    }
    //---------------------------------------group-participants.update-----------------------------------------//
    bot.ev.on(
      "group-participants.update",
      async (msg: GroupParticipantUpdate) => {
        console.log("[group-participants.update]");
        try {
          let from = msg.id;
          let numJid = msg.participants[0];

          let num_split = `${numJid.split("@s.whatsapp.net")[0]}`;
          if (numJid === botNumberJid && msg.action === "remove") {
            //bot is removed
            bot.sendMessage(myNumberWithJid, {
              text: `Bot is removed from group.`,
            });
            return;
          }

          cache.del(from + ":groupMetadata");
          const groupMetadata = await bot.groupMetadata(from);
          let groupSubject = groupMetadata.subject;

          if (msg.action === "add") {
            // if (groupSubject.toUpperCase().includes("<{PVX}>"))
            //   await setGroupParticipant(numJid, from, "ADD");
            await memberAddCheck(
              bot,
              from,
              num_split,
              numJid,
              groupSubject,
              pvxgroups
            );
            const text = `${groupSubject}\n[ADD] ${num_split}`;
            await bot.sendMessage(myNumberWithJid, { text });
            console.log(text);
            ++stats.memberJoined;
          } else if (msg.action === "remove") {
            // if (groupSubject.toUpperCase().includes("<{PVX}>"))
            //   await setGroupParticipant(numJid, from, "REMOVE");
            const text = `${groupSubject}\n[REMOVE] ${num_split}`;
            await bot.sendMessage(myNumberWithJid, { text });
            console.log(text);
            ++stats.memberLeft;
          }
        } catch (err) {
          await LoggerBot(bot, "group-participants.update", err, msg);
        }
      }
    );

    interface GroupMessageUpsert {
      messages: WAMessage[];
      type: MessageUpsertType;
    }
    bot.ev.on("messages.upsert", async (msgs: GroupMessageUpsert) => {
      // console.log("m", JSON.stringify(m, undefined, 2));
      // console.log(msgs.messages);
      try {
        //type: append (whatsapp web), notify (app)
        if (msgs.type === "append") return;
        const msg = msgs.messages[0];
        if (!msg.message) return; //when demote, add, remove, etc happen then msg.message is not there

        //type to extract body text
        const type: string = msg.message.conversation
          ? "textMessage"
          : msg.message.reactionMessage
          ? "reactionMessage"
          : msg.message.imageMessage
          ? "imageMessage"
          : msg.message.videoMessage
          ? "videoMessage"
          : msg.message.stickerMessage
          ? "stickerMessage"
          : msg.message.documentMessage
          ? "documentMessage"
          : msg.message.audioMessage
          ? "audioMessage"
          : msg.message.ephemeralMessage
          ? "ephemeralMessage"
          : msg.message.extendedTextMessage
          ? "extendedTextMessage"
          : msg.message.viewOnceMessageV2
          ? "viewOnceMessageV2"
          : "other";
        //ephemeralMessage are from disappearing chat

        const acceptedType = [
          "textMessage",
          "imageMessage",
          "videoMessage",
          "stickerMessage",
          "documentMessage",
          "extendedTextMessage",
        ];
        if (!acceptedType.includes(type)) {
          return;
        }

        //TODO: FIX
        // ++stats.totalMessages;
        // if (type === "extendedTextMessage") ++stats["textMessage"];
        // else ++stats[type];

        const isMedia = type === "imageMessage" || type === "videoMessage"; //image or video

        //body will have the text message
        let body = msg.message.conversation
          ? msg.message.conversation
          : msg.message.reactionMessage?.text
          ? msg.message.reactionMessage.text
          : msg.message.imageMessage?.caption
          ? msg.message.imageMessage.caption
          : msg.message.videoMessage?.caption
          ? msg.message.videoMessage.caption
          : msg.message.documentMessage?.caption
          ? msg.message.documentMessage.caption
          : msg.message.extendedTextMessage?.text
          ? msg.message.extendedTextMessage.text
          : "";
        body = body.replace(/\n|\r/g, ""); //remove all \n and \r

        let isCmd = body.startsWith(prefix);

        const from = msg.key.remoteJid;
        if (!from) return;
        const isGroup = from.endsWith("@g.us");

        let groupMetadata: GroupMetadata | undefined = undefined;
        groupMetadata = cache.get(from + ":groupMetadata");

        if (isGroup && !groupMetadata) {
          groupMetadata = await bot.groupMetadata(from);
          cache.set(from + ":groupMetadata", groupMetadata, 60 * 60);
        }
        let sender = groupMetadata ? msg.key.participant : from;
        if (!sender) return;
        if (msg.key.fromMe) sender = botNumberJid;

        //remove : from number
        if (sender.includes(":"))
          sender =
            sender.slice(0, sender.search(":")) +
            sender.slice(sender.search("@"));
        const senderNumber = sender.split("@")[0];
        const senderName = msg.pushName;

        const groupName: string | undefined = groupMetadata?.subject;
        const groupDesc: string | undefined = groupMetadata?.desc?.toString();
        const groupMembers: GroupParticipant[] | undefined =
          groupMetadata?.participants;
        const groupAdmins: string[] | undefined = getGroupAdmins(groupMembers);
        const isBotGroupAdmins: boolean =
          groupAdmins?.includes(botNumberJid) || false;
        const isGroupAdmins: boolean = groupAdmins?.includes(sender) || false;

        if (pvx) {
          //Count message
          if (
            groupName?.toUpperCase().includes("<{PVX}>") &&
            from !== pvxgroups.pvxstickeronly1 &&
            from != pvxgroups.pvxstickeronly2 &&
            from != pvxgroups.pvxdeals &&
            from !== pvxgroups.pvxtesting
          ) {
            const res = await setCountMember(sender, from, senderName);
            // console.log(JSON.stringify(res));
            await countRemainder(
              bot.sendMessage,
              res,
              from,
              senderNumber,
              sender
            );
          }

          //count video
          if (from == pvxgroups.pvxmano && type === "videoMessage") {
            setCountVideo(sender, from);
          }

          //Forward all stickers
          if (
            groupName?.toUpperCase().startsWith("<{PVX}>") &&
            type === "stickerMessage" &&
            isStickerForward === "true" &&
            from !== pvxgroups.pvxstickeronly1 &&
            from != pvxgroups.pvxstickeronly2 &&
            from !== pvxgroups.pvxmano
          ) {
            const res = await forwardSticker(
              bot.sendMessage,
              msg.message.stickerMessage,
              pvxgroups.pvxstickeronly1,
              pvxgroups.pvxstickeronly2
            );
            if (res) ++stats.stickerForwarded;
            else ++stats.stickerNotForwarded;
            return;
          }

          //auto sticker maker in pvx sticker group [empty caption], less than 2mb
          if (
            from === pvxgroups.pvxsticker &&
            body === "" &&
            msg.message.videoMessage?.fileLength &&
            Number(msg.message.videoMessage.fileLength) < 2 * 1000 * 1000
          ) {
            isCmd = true;
            body = "!s";
          }
        }

        if (!isCmd) {
          const messageLog =
            "[MESSAGE] " +
            (body ? body.substr(0, 30) : type) +
            " [FROM] " +
            senderNumber +
            " [IN] " +
            (groupName || from);
          console.log(messageLog);
          return;
        }

        if (body[1] == " ") body = body[0] + body.slice(2); //remove space when space btw prefix and commandName like "! help"
        const args = body.slice(1).trim().split(/ +/);
        let command = args.shift()?.toLowerCase();
        if (!command) command = "";

        // Display every command info
        console.log(
          "[COMMAND]",
          command,
          "[FROM]",
          senderNumber,
          "[IN]",
          groupName || from
        );

        if (
          ["score", "scorecard", "scoreboard", "sc", "sb"].includes(command)
        ) {
          //for latest group desc
          groupMetadata = await bot.groupMetadata(from);
        }

        // let groupData: GroupData | undefined = undefined;
        // if (groupMetadata) {
        //   groupData = getGroupData(groupMetadata, botNumberJid, sender);
        // }

        const content = JSON.stringify(msg.message);
        const isTaggedImage =
          type === "extendedTextMessage" && content.includes("imageMessage");
        const isTaggedVideo =
          type === "extendedTextMessage" && content.includes("videoMessage");
        const isTaggedSticker =
          type === "extendedTextMessage" && content.includes("stickerMessage");
        const isTaggedDocument =
          type === "extendedTextMessage" && content.includes("documentMessage");

        const reply = async (text: string | undefined): Promise<boolean> => {
          if (!text) return false;
          await bot.sendMessage(from, { text }, { quoted: msg });
          return true;
        };

        //CHECK IF COMMAND IF DISABLED FOR CURRENT GROUP OR NOT, not applicable for group admin
        //TODO: FIX
        // let resDisabled = [];
        // if (isGroup && !isGroupAdmins) {
        //   resDisabled = cache.get(from + ":resDisabled");
        //   if (!resDisabled) {
        //     resDisabled = await getDisableCommandData(from);
        //     const success = cache.set(
        //       from + ":resDisabled",
        //       resDisabled,
        //       60 * 60
        //     );
        //   }
        // }
        // if (resDisabled.includes(command)) {
        //   await reply("❌ Command disabled for this group!");
        //   return;
        // }
        // if (command === "enable" || command === "disable") {
        //   cache.del(from + ":resDisabled");
        // }

        // send every command info to my whatsapp, won't work when i send something for bot
        if (myNumber && myNumberWithJid !== sender) {
          ++stats.commandExecuted;
          await bot.sendMessage(myNumberWithJid, {
            text: `${stats.commandExecuted}) [${prefix}${command}] [${groupName}]`,
          });
        }

        switch (command) {
          //TODO: FIX
          // case "stats":
          //   let statsMessage = "📛 PVX BOT STATS 📛\n";

          //   Object.keys(stats).forEach((key) => {
          //     statsMessage += `\n${key}: ${stats[key]}`;
          //   });

          //   await reply(statsMessage);
          //   return;

          // case "check":
          //   return;

          case "test":
            if (myNumberWithJid !== sender) {
              await reply(`❌ Command only for owner for bot testing purpose!`);
              return;
            }

            if (args.length === 0) {
              await reply(`❌ empty query!`);
              return;
            }
            try {
              let resultTest = eval(args[0]);
              if (typeof resultTest === "object")
                await reply(JSON.stringify(resultTest));
              else await reply(resultTest.toString());
            } catch (err) {
              await reply((err as Error).stack);
            }
            return;
        }

        let msgInfoObj: MsgInfoObj = {
          from,
          prefix,
          sender,
          senderName,
          groupName,
          groupDesc,
          isBotGroupAdmins,
          isGroupAdmins,
          isMedia,
          type,
          isTaggedImage,
          isTaggedDocument,
          isTaggedVideo,
          isTaggedSticker,
          myNumber,
          botNumberJid,
          command,
          args,
          groupMembers,
          groupAdmins,
          reply,
          milestones,
          allCommandsName,
        };

        try {
          /* ----------------------------- public commands ---------------------------- */
          if (commandsPublic[command]) {
            await commandsPublic[command](bot, msg, msgInfoObj);
            return;
          }

          /* ------------------------- group members commands ------------------------- */
          if (commandsMembers[command]) {
            if (groupMetadata) {
              await commandsMembers[command](bot, msg, msgInfoObj);
              return;
            }
            reply(
              "❌ Group command only!\n\nJoin group to use commands:\nhttps://chat.whatsapp.com/CZeWkEFdoF28bTJPAY63ux"
            );
            return;
          }

          /* -------------------------- group admins commands ------------------------- */
          if (commandsAdmins[command]) {
            if (!groupMetadata) {
              reply(
                "❌ Group command only!\n\nJoin group to use commands:\nhttps://chat.whatsapp.com/CZeWkEFdoF28bTJPAY63ux"
              );
              return;
            }

            if (isGroupAdmins) {
              await commandsAdmins[command](bot, msg, msgInfoObj);
              return;
            }
            reply("❌ Admin command!");
            return;
          }

          /* ----------------------------- owner commands ----------------------------- */
          if (commandsOwners[command]) {
            if (myNumberWithJid === sender) {
              await commandsOwners[command](bot, msg, msgInfoObj);
              return;
            }
            reply("❌ Owner command only!");
            return;
          }
        } catch (err) {
          await reply((err as Error).stack);
          await LoggerBot(bot, `COMMAND-ERROR in ${groupName}`, err, msg);
          return;
        }

        /* ----------------------------- unknown command ---------------------------- */
        let message = `Send ${prefix}help for <{PVX}> BOT commands list`;

        const matches = stringSimilarity.findBestMatch(
          command,
          allCommandsName
        );
        if (matches.bestMatch.rating > 0.5)
          message =
            `Did you mean ${prefix}${matches.bestMatch.target}\n\n` + message;

        reply(message);
        if (command) {
          await addUnknownCmd(command);
        }
      } catch (err) {
        await LoggerBot(bot, "messages.upsert", err, msgs);
      }
    });

    bot.ev.on("connection.update", async (update) => {
      try {
        LoggerTg(`connection.update: ${JSON.stringify(update)}`);
        const { connection, lastDisconnect } = update;
        if (connection === "open") {
          console.log("Connected");
          await bot.sendMessage(myNumberWithJid, {
            text: `[BOT STARTED] - ${startCount}`,
          });
          milestones = await addDefaultMilestones(
            bot.groupFetchAllParticipating,
            pvxgroups
          );
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
          // reconnect if not logged out
          if (!lastDisconnect) return;
          const shouldReconnect =
            (lastDisconnect.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;
          if (shouldReconnect) {
            await LoggerBot(
              false,
              "CONNECTION-CLOSED",
              lastDisconnect.error,
              update
            );
            ++startCount;

            setTimeout(() => {
              startBot();
            }, 1000 * 15);
          } else {
            LoggerTg(
              `[CONNECTION-CLOSED]: You are logged out\nRestarting in 5 sec to scan new QR code!`
            );
            await dropAuth();
            console.log(
              "[CONNECTION-CLOSED]: You are logged out\nRestarting in 5 sec to scan new QR code!"
            );
            setTimeout(() => {
              startBot();
            }, 1000 * 5);
          }
        }

        console.log("connection update", update);
      } catch (err) {
        await LoggerBot(false, "connection.update", err, update);
      }
    });
    // listen for when the auth credentials is updated
    bot.ev.on("creds.update", async () => {
      try {
        await saveCreds();
        await storeAuth(state);
      } catch (err) {
        await LoggerBot(false, "creds.update", err, undefined);
      }
    });

    return bot;
  } catch (err) {
    await LoggerBot(false, "BOT-ERROR", err, "");
  }

  async function getMessage(
    key: WAMessageKey
  ): Promise<WAMessageContent | undefined> {
    if (store) {
      const msg = await store.loadMessage(key.remoteJid!, key.id!);
      return msg?.message || undefined;
    }

    // only if store is present
    return proto.Message.fromObject({});
  }
};

startBot();
