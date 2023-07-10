import stringSimilarity from "string-similarity";

import {
  GroupMetadata,
  GroupParticipant,
  MessageUpsertType,
  WAMessage,
} from "@adiwajshing/baileys";
import {
  isForwardSticker,
  myNumber,
  myNumberWithJid,
  prefix,
  pvx,
  pvxgroups,
  pvxgroupsList,
  stats,
} from "./constants/constants";
import { cache } from "./utils/cache";
import { setCountMember } from "./db/countMemberDB";
import countRemainder from "./functions/countRemainder";
import { setCountVideo } from "./db/countVideoDB";
import forwardSticker from "./functions/forwardSticker";
import { Bot } from "./interface/Bot";
import getGroupAdmins from "./functions/getGroupAdmins";
import { getGroupsData } from "./db/groupsDB";
import { MsgInfoObj } from "./interface/msgInfoObj";
import { LoggerBot } from "./functions/loggerBot";
import { addUnknownCmd } from "./db/addUnknownCmdDB";
import { CommandsObj } from "./interface/CommandsObj";
import { Milestones } from "./functions/addDefaultMilestone";

export interface MessageUpsert {
  messages: WAMessage[];
  type: MessageUpsertType;
}

export const messagesUpsert = async (
  msgs: MessageUpsert,
  bot: Bot,
  botNumberJid: string,
  commandsPublic: CommandsObj,
  commandsMembers: CommandsObj,
  commandsAdmins: CommandsObj,
  commandsOwners: CommandsObj,
  allCommandsName: string[],
  milestones: Milestones
) => {
  // console.log("msgs: ", JSON.stringify(msgs, undefined, 2));
  // console.log(msgs.messages);
  try {
    // type: append (whatsapp web), notify (app)
    if (msgs.type === "append") return;

    // const msg: WAMessage = msgs.messages[0];
    msgs.messages.forEach(async (msg: WAMessage) => {
      // when demote, add, remove, etc happen then msg.message is not there
      if (!msg.message) return;

      // type to extract body text
      let type:
        | "textMessage"
        | "imageMessage"
        | "videoMessage"
        | "stickerMessage"
        | "documentMessage"
        | "extendedTextMessage"
        | "otherMessage";

      if (msg.message.conversation) {
        type = "textMessage";
      } else if (msg.message.imageMessage) {
        type = "imageMessage";
      } else if (msg.message.videoMessage) {
        type = "videoMessage";
      } else if (msg.message.stickerMessage) {
        type = "stickerMessage";
      } else if (msg.message.documentMessage) {
        type = "documentMessage";
      } else if (msg.message.extendedTextMessage) {
        type = "extendedTextMessage";
      } else type = "otherMessage";

      // ephemeralMessage are from disappearing chat
      // reactionMessage, audioMessage

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

      stats.totalMessages += 1;
      if (type === "extendedTextMessage") stats.textMessage += 1;
      else stats[type] += 1;

      // body will have the text message
      let body: string;
      if (msg.message.conversation) {
        body = msg.message.conversation;
      } else if (msg.message.reactionMessage?.text) {
        body = msg.message.reactionMessage.text;
      } else if (msg.message.imageMessage?.caption) {
        body = msg.message.imageMessage.caption;
      } else if (msg.message.videoMessage?.caption) {
        body = msg.message.videoMessage.caption;
      } else if (msg.message.documentMessage?.caption) {
        body = msg.message.documentMessage.caption;
      } else if (msg.message.extendedTextMessage?.text) {
        body = msg.message.extendedTextMessage.text;
      } else {
        body = "";
      }

      body = body.replace(/\n|\r/g, ""); // remove all \n and \r

      let isCmd = body.startsWith(prefix);

      const from = msg.key.remoteJid;
      if (!from) return;
      if (pvx === "true" && !pvxgroupsList.includes(from)) return; // only for PVX groups temporary

      const isGroup = from.endsWith("@g.us");

      let groupMetadata: GroupMetadata | undefined;
      groupMetadata = cache.get(`${from}:groupMetadata`);

      if (isGroup && !groupMetadata) {
        console.log("FETCHING GROUP METADATA: ", from);

        groupMetadata = await bot.groupMetadata(from);
        // console.log(groupMetadata);
        cache.set(`${from}:groupMetadata`, groupMetadata, 60 * 60 * 24); // 24 hours
      }
      let sender = groupMetadata ? msg.key.participant : from;
      if (!sender) return;
      if (msg.key.fromMe) sender = botNumberJid;

      // remove : from number
      if (sender.includes(":")) {
        sender =
          sender.slice(0, sender.search(":")) +
          sender.slice(sender.search("@"));
      }
      const senderNumber = sender.split("@")[0];
      let senderName = msg.pushName;
      if (!senderName) senderName = "null";

      const groupName: string | undefined = groupMetadata?.subject;

      // Count message
      if (pvx === "true") {
        if (
          groupName?.toUpperCase().includes("<{PVX}>") &&
          pvxgroupsList.includes(from) &&
          from !== pvxgroups.pvxstickeronly1 &&
          from !== pvxgroups.pvxstickeronly2 &&
          from !== pvxgroups.pvxdeals &&
          from !== pvxgroups.pvxtesting
        ) {
          if (from === pvxgroups.pvxsticker && msg.message.stickerMessage) {
            console.log("skipping count of sticker message in PVX sticker.");
            return;
          }
          const setCountMemberRes = await setCountMember(
            sender,
            from,
            senderName
          );
          await countRemainder(
            bot,
            setCountMemberRes,
            from,
            senderNumber,
            sender
          );
        }

        // count video
        if (from === pvxgroups.pvxmano && type === "videoMessage") {
          await setCountVideo(sender, from);
        }

        // Forward all stickers
        if (
          groupName?.toUpperCase().startsWith("<{PVX}>") &&
          msg.message.stickerMessage &&
          isForwardSticker === "true" &&
          from !== pvxgroups.pvxstickeronly1 &&
          from !== pvxgroups.pvxstickeronly2 &&
          from !== pvxgroups.pvxmano
        ) {
          const forwardStickerRes = await forwardSticker(
            bot,
            msg.message.stickerMessage,
            pvxgroups.pvxstickeronly1,
            pvxgroups.pvxstickeronly2
          );
          if (forwardStickerRes) stats.stickerForwarded += 1;
          else stats.stickerNotForwarded += 1;
          return;
        }

        // auto sticker maker in pvx sticker group [empty caption], less than 2mb
        if (
          from === pvxgroups.pvxsticker &&
          body === "" &&
          (msg.message.imageMessage ||
            (msg.message.videoMessage?.fileLength &&
              Number(msg.message.videoMessage.fileLength) < 2 * 1000 * 1000))
        ) {
          isCmd = true;
          body = "!s";
        }
      }

      if (!isCmd) {
        const messageLog = `[MESSAGE] ${
          body ? body.substr(0, 30) : type
        } [FROM] ${senderNumber} [IN] ${groupName || from}`;
        console.log(messageLog);
        return;
      }

      if (body[1] === " ") body = body[0] + body.slice(2); // remove space when space btw prefix and commandName like "! help"
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

      if (["score", "scorecard", "scoreboard", "sc", "sb"].includes(command)) {
        // for latest group desc
        groupMetadata = await bot.groupMetadata(from);
      }

      const groupDesc: string | undefined = groupMetadata?.desc?.toString();
      const groupMembers: GroupParticipant[] | undefined =
        groupMetadata?.participants;
      const groupAdmins: string[] | undefined = getGroupAdmins(groupMembers);
      const isBotGroupAdmins: boolean =
        groupAdmins?.includes(botNumberJid) || false;
      const isGroupAdmins: boolean = groupAdmins?.includes(sender) || false;

      // let groupData: GroupData | undefined = undefined;
      // if (groupMetadata) {
      //   groupData = getGroupData(groupMetadata, botNumberJid, sender);
      // }

      const reply = async (text: string | undefined): Promise<boolean> => {
        if (!text) return false;
        await bot.sendMessage(from, { text }, { quoted: msg });
        return true;
      };

      // CHECK IF COMMAND IF DISABLED FOR CURRENT GROUP OR NOT, not applicable for group admin
      let resDisabled: string[] | undefined = [];
      if (groupMetadata && !isGroupAdmins) {
        resDisabled = cache.get(`${from}:resDisabled`);
        if (!resDisabled) {
          const getDisableCommandRes = await getGroupsData(from);
          resDisabled =
            getDisableCommandRes.length &&
            getDisableCommandRes[0].commands_disabled
              ? getDisableCommandRes[0].commands_disabled
              : [];
          cache.set(`${from}:resDisabled`, resDisabled, 60 * 60);
        }
      }
      if (resDisabled.includes(command)) {
        await reply("❌ Command disabled for this group!");
        return;
      }
      if (command === "enable" || command === "disable") {
        cache.del(`${from}:resDisabled`);
      }

      // send every command info to my whatsapp, won't work when i send something for bot
      if (myNumber && myNumberWithJid !== sender) {
        stats.commandExecuted += 1;
        await bot.sendMessage(myNumberWithJid, {
          text: `${stats.commandExecuted}) [${prefix}${command}] [${groupName}]`,
        });
      }

      switch (command) {
        case "stats": {
          let statsMessage = "📛 PVX BOT STATS 📛\n";

          let key: keyof typeof stats;
          for (key in stats) {
            if (Object.prototype.hasOwnProperty.call(stats, key)) {
              statsMessage += `\n${key}: ${stats[key]}`;
            }
          }

          await reply(statsMessage);
          return;
        }

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
            const resultTest = eval(args[0]);
            if (typeof resultTest === "object") {
              await reply(JSON.stringify(resultTest));
            } else await reply(resultTest.toString());
          } catch (err) {
            await reply((err as Error).stack);
          }
          return;

        default:
      }

      const msgInfoObj: MsgInfoObj = {
        from,
        sender,
        senderName,
        groupName,
        groupDesc,
        groupMembers,
        groupAdmins,
        isBotGroupAdmins,
        isGroupAdmins,
        botNumberJid,
        command,
        args,
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
          await reply(
            "❌ Group command only!\n\nJoin group to use commands:\nhttps://chat.whatsapp.com/CZeWkEFdoF28bTJPAY63ux"
          );
          return;
        }

        /* -------------------------- group admins commands ------------------------- */
        if (commandsAdmins[command]) {
          if (!groupMetadata) {
            await reply(
              "❌ Group command only!\n\nJoin group to use commands:\nhttps://chat.whatsapp.com/CZeWkEFdoF28bTJPAY63ux"
            );
            return;
          }

          if (isGroupAdmins) {
            await commandsAdmins[command](bot, msg, msgInfoObj);
            return;
          }
          await reply("❌ Admin command!");
          return;
        }

        /* ----------------------------- owner commands ----------------------------- */
        if (commandsOwners[command]) {
          if (myNumberWithJid === sender) {
            await commandsOwners[command](bot, msg, msgInfoObj);
            return;
          }
          await reply("❌ Owner command only!");
          return;
        }
      } catch (err) {
        await reply((err as Error).toString());
        await LoggerBot(bot, `COMMAND-ERROR in ${groupName}`, err, msg);
        return;
      }

      /* ----------------------------- unknown command ---------------------------- */
      let message = `Send ${prefix}help for <{PVX}> BOT commands list`;

      const matches = stringSimilarity.findBestMatch(command, allCommandsName);
      if (matches.bestMatch.rating > 0.5) {
        message = `Did you mean ${prefix}${matches.bestMatch.target}\n\n${message}`;
      }
      await reply(message);
      if (command) {
        await addUnknownCmd(command);
      }
    });
  } catch (err) {
    await LoggerBot(bot, "messages.upsert", err, msgs);
  }
};
