import stringSimilarity from "string-similarity";

import {
  GroupMetadata,
  GroupParticipant,
  MessageUpsertType,
  WAMessage,
} from "@whiskeysockets/baileys";
import { prefix, pvxgroups, pvxgroupsList, stats } from "./utils/constants";
import { cache } from "./utils/cache";
import { setCountMember, setCountVideo } from "./db/countMemberDB";
import countRemainder from "./functions/countRemainder";
import forwardSticker from "./functions/forwardSticker";
import { Bot } from "./interfaces/Bot";
import getGroupAdmins from "./functions/getGroupAdmins";
import { getGroupData } from "./db/pvxGroupDB";
import { MsgInfoObj } from "./interfaces/msgInfoObj";
import { loggerBot, loggerTg, sendLogToOwner } from "./utils/logger";
import { addUnknownCmd } from "./db/unknownCmdDB";
import { CommandsObj } from "./interfaces/CommandsObj";
import { DefaultBadge } from "./functions/addDefaultBadges";
import {
  forwardStickerEnabled,
  ownerNumberWithJid,
  pvxFunctionsEnabled,
} from "./utils/config";
import { setCountMemberToday } from "./db/countMemberTodayDB";

export interface MessageUpsert {
  messages: WAMessage[];
  type: MessageUpsertType;
}

interface SpamMessageCheck {
  [from: string]: {
    [sender: string]: {
      count: number;
      body: string;
    };
  };
}
const spamMessageCheck: SpamMessageCheck = {};

export const messagesUpsert = async (
  msgs: MessageUpsert,
  bot: Bot,
  botNumberJid: string,
  commandsPublic: CommandsObj,
  commandsMembers: CommandsObj,
  commandsAdmins: CommandsObj,
  commandsOwners: CommandsObj,
  allCommandsName: string[],
  defaultBadges: DefaultBadge
) => {
  // console.log("msgs: ", JSON.stringify(msgs, undefined, 2));
  // console.log(msgs.messages);
  try {
    // type: append (whatsapp web), notify (app)
    if (msgs.type === "append") return;

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

      let body = "";

      if (msg.message.conversation) {
        type = "textMessage";
        body = msg.message.conversation;
      } else if (msg.message.imageMessage) {
        type = "imageMessage";
        body = msg.message.imageMessage.caption ?? "";
      } else if (msg.message.videoMessage) {
        type = "videoMessage";
        body = msg.message.videoMessage.caption ?? "";
      } else if (msg.message.stickerMessage) {
        type = "stickerMessage";
      } else if (msg.message.documentMessage) {
        type = "documentMessage";
        body = msg.message.documentMessage.caption ?? "";
      } else if (msg.message.extendedTextMessage) {
        type = "extendedTextMessage";
        body = msg.message.extendedTextMessage.text ?? "";
      } else {
        type = "otherMessage";
        return;
      }

      // ephemeralMessage are from disappearing chat
      // reactionMessage, audioMessage

      stats.totalMessages += 1;
      if (type === "extendedTextMessage") stats.textMessage += 1;
      else stats[type] += 1;

      body = body.replace(/\n|\r/g, ""); // remove all \n and \r

      const isCmd = body.startsWith(prefix);

      const from = msg.key.remoteJid;
      if (!from) return;
      let sender = msg.key.participant ?? from;

      // // only for PVX groups temporary
      // if (
      //   pvxFunctionsEnabled === "true" &&
      //   !pvxgroupsList.includes(from) &&
      //   sender !== ownerNumberWithJid
      // ) {
      //   return;
      // }

      const isGroup = from.endsWith("@g.us");

      let groupMetadata: GroupMetadata | undefined;
      groupMetadata = cache.get(`${from}:groupMetadata`);

      if (isGroup && !groupMetadata) {
        console.log("FETCHING GROUP METADATA: ", from);

        groupMetadata = await bot.groupMetadata(from);
        cache.set(`${from}:groupMetadata`, groupMetadata, 60 * 60 * 24); // 24 hours
      }

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

      // Spam checker start
      // console.log(JSON.stringify(spamMessageCheck));
      if (spamMessageCheck[from] && spamMessageCheck[from][sender]) {
        if (spamMessageCheck[from][sender].body === body && body) {
          // If the body is the same, increment the count
          spamMessageCheck[from][sender].count += 1;
        } else {
          spamMessageCheck[from][sender].count = 1;
          spamMessageCheck[from][sender].body = body;
        }
      } else {
        spamMessageCheck[from] = {
          [sender]: {
            count: 1,
            body,
          },
        };
      }

      if (spamMessageCheck[from][sender].count === 10) {
        await sendLogToOwner(bot, JSON.stringify(spamMessageCheck));
        console.log(
          `Spam detected! The message "${body}" has been sent 10 times by ${senderNumber} in group ${groupName}`
        );
        await bot.sendMessage(pvxgroups.pvxsubadmin, {
          text: `Spam detected! The message "${body}" has been sent 10 times by ${senderNumber} in group ${groupName}`,
        });
        const response = await bot.groupParticipantsUpdate(
          from,
          [sender],
          "remove"
        );
        if (response[0].status === "200") {
          await bot.sendMessage(from, {
            text: "_✔ Number removed from group due to spam!_",
          });
        } else {
          await bot.sendMessage(from, {
            text: "_❌ There was a problem removing the user!_",
          });
        }
      }
      // Spam checker end

      // Forward all stickers
      if (
        forwardStickerEnabled === "true" &&
        groupName?.toUpperCase().startsWith("<{PVX}>") &&
        msg.message.stickerMessage &&
        from !== pvxgroups.pvxstickeronly1 &&
        from !== pvxgroups.pvxstickeronly2 &&
        from !== pvxgroups.pvxmano
      ) {
        const forwardStickerRes = await forwardSticker(
          bot,
          msg.message.stickerMessage
        );
        if (forwardStickerRes) stats.stickerForwarded += 1;
        else stats.stickerNotForwarded += 1;
      }

      if (pvxFunctionsEnabled === "true") {
        // Count message
        if (
          groupName?.toUpperCase().includes("<{PVX}>") &&
          pvxgroupsList.includes(from) &&
          from !== pvxgroups.pvxstickeronly1 &&
          from !== pvxgroups.pvxstickeronly2 &&
          from !== pvxgroups.pvxdeals &&
          from !== pvxgroups.pvxtesting &&
          from !== pvxgroups.pvxtechonly
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
          // await setCountMemberMonth(sender, from, senderName);
          await setCountMemberToday(sender, from);
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

        // auto sticker maker in pvx sticker group [empty caption], less than 2mb
        // if (
        //   from === pvxgroups.pvxsticker &&
        //   body === "" &&
        //   (msg.message.imageMessage ||
        //     (msg.message.videoMessage?.fileLength &&
        //       Number(msg.message.videoMessage.fileLength) < 2 * 1000 * 1000))
        // ) {
        //   isCmd = true;
        //   body = "!s";
        // }
      }

      if (!isCmd) {
        const messageLog = `[MESSAGE] ${
          body ? body.substr(0, 30) : type
        } [FROM] ${senderNumber} [IN] ${groupName ?? from}`;
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
        groupName ?? from
      );

      if (["score", "scorecard", "scoreboard", "sc", "sb"].includes(command)) {
        // for latest group desc
        groupMetadata = await bot.groupMetadata(from);
      }

      const groupDesc: string | undefined = groupMetadata?.desc?.toString();
      const groupMembers: GroupParticipant[] | undefined =
        groupMetadata?.participants;
      const groupAdmins: string[] | undefined = getGroupAdmins(groupMembers);
      const isBotGroupAdmin: boolean =
        groupAdmins?.includes(botNumberJid) || false;
      const isSenderGroupAdmin: boolean =
        groupAdmins?.includes(sender) || false;

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
      if (groupMetadata && !isSenderGroupAdmin) {
        resDisabled = cache.get(`${from}:resDisabled`);
        if (!resDisabled) {
          const getDisableCommandRes = await getGroupData(from);
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

      // send every command info to my whatsapp number, won't work when I send something to bot
      if (ownerNumberWithJid !== sender && ownerNumberWithJid) {
        stats.commandExecuted += 1;
        // await bot.sendMessage(ownerNumberWithJid, {
        //   text: `${stats.commandExecuted}) [${prefix}${command}] [${groupName}]`,
        // });
        await loggerTg(
          `${stats.commandExecuted}) [${prefix}${command}] [${groupName}]`
        );
      }

      switch (command) {
        case "stats": {
          let statsMessage = "📛 PVX BOT STATS 📛\n";

          let key: keyof typeof stats;
          // eslint-disable-next-line no-restricted-syntax
          for (key in stats) {
            if (Object.prototype.hasOwnProperty.call(stats, key)) {
              statsMessage += `\n${key}: ${stats[key]}`;
            }
          }

          await reply(statsMessage);
          return;
        }

        case "test":
          if (ownerNumberWithJid !== sender) {
            await reply(`❌ Command only for owner for bot testing purpose!`);
            return;
          }

          if (args.length === 0) {
            await reply(`❌ empty query!`);
            return;
          }
          try {
            // eslint-disable-next-line no-eval
            const result = eval(args[0]);
            if (typeof result === "object") {
              await reply(JSON.stringify(result));
            } else {
              await reply(result.toString());
            }
          } catch (err) {
            if (err instanceof Error) {
              await reply(err.stack);
            }
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
        isBotGroupAdmin,
        isSenderGroupAdmin,
        botNumberJid,
        command,
        args,
        reply,
        defaultBadges,
        allCommandsName,
      };

      const botGroupLink = "https://chat.whatsapp.com/DCo1UEVYUt1GEclJ1uZzjA";

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
            `❌ Group command only!\n\nJoin group to use commands:\n${botGroupLink}`
          );
          return;
        }

        /* -------------------------- group admins commands ------------------------- */
        if (commandsAdmins[command]) {
          if (groupMetadata) {
            if (isSenderGroupAdmin) {
              await commandsAdmins[command](bot, msg, msgInfoObj);
              return;
            }
            await reply("❌ Admin command!");
            return;
          }
          await reply(
            `❌ Group command only!\n\nJoin group to use commands:\n${botGroupLink}`
          );
          return;
        }

        /* ----------------------------- owner commands ----------------------------- */
        if (commandsOwners[command]) {
          if (ownerNumberWithJid === sender) {
            await commandsOwners[command](bot, msg, msgInfoObj);
            return;
          }
          await reply("❌ Owner command only!");
          return;
        }
      } catch (err) {
        if (err instanceof Error) {
          await reply(err.toString());
        }
        await loggerBot(bot, `COMMAND-ERROR in ${groupName}`, err, msg);
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
    await loggerBot(bot, "messages.upsert", err, msgs);
  }
};
