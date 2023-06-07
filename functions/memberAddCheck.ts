import { Pvxgroups } from "../constants/constants";
import { getBlacklist } from "../db/blacklistDB";
import { Bot } from "../interface/Bot";

import { LoggerBot } from "./loggerBot";

export const memberAddCheck = async (
  bot: Bot,
  from: string,
  num_split: string,
  numJid: string,
  groupSubject: string,
  pvxgroups: Pvxgroups,
  myNumber: string | undefined,
  prefix: string
) => {
  const { pvxcommunity, pvxprogrammer, pvxmano, pvxmovies, pvxsticker } =
    pvxgroups;
  try {
    if (groupSubject.toUpperCase().includes("<{PVX}>")) {
      //if number is blacklisted
      const getBlacklistRes = await getBlacklist(num_split);
      if (getBlacklistRes.length) {
        await bot.groupParticipantsUpdate(from, [numJid], "remove");
        await bot.sendMessage(from, {
          text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nNumber is blacklisted !!!!\nReason: ${getBlacklistRes[0].reason}`,
        });
        await bot.sendMessage(myNumber + "@s.whatsapp.net", {
          text: `${num_split} is removed from ${groupSubject}. Blacklisted!`,
        });
        return;
      }

      if (!num_split.startsWith("91")) {
        await bot.sendMessage(from, {
          text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nOnly +91 numbers are allowed !!!!`,
        });
        await bot.groupParticipantsUpdate(from, [numJid], "remove");

        await bot.sendMessage(myNumber + "@s.whatsapp.net", {
          text: `${num_split} is removed from ${groupSubject}. Not 91!`,
        });
        return;
      }
      //for study group
      // if (from === pvxstudy) {
      //   await bot.sendMessage(
      //     from,
      //     {
      //       text: `Welcome @${num_split}\nhttps://pvxcommunity.com/\n\nKindly fill the Biodata form (mandatory for all)\n\n👇🏻👇🏻👇🏻👇🏻👇🏻\nhttps://forms.gle/uuvUwV5fTk8JAjoTA`,
      //       mentions: [numJid],
      //     },
      //     {
      //       quoted: {
      //         key: {
      //           remoteJid: from,
      //           fromMe: false,
      //           id: "710B5CF29EE7471fakeid",
      //           participant: "0@s.whatsapp.net",
      //         },
      //         messageTimestamp: 1671784177,
      //         pushName: "WhatsApp",
      //         message: { conversation: "WELCOME TO PVX STUDY" },
      //       },
      //     }
      //   );
      // }
      //for movies group
      else if (from === pvxmovies) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${num_split}\nhttps://pvxcommunity.com/\n\nWhat are you currently watching..?`,
            mentions: [numJid],
          },
          {
            quoted: {
              key: {
                remoteJid: from,
                fromMe: false,
                id: "710B5CF29EE7471fakeid",
                participant: "0@s.whatsapp.net",
              },
              messageTimestamp: 1671784177,
              pushName: "WhatsApp",
              message: { conversation: "WELCOME TO PVX MOVIES" },
            },
          }
        );
      }
      //for community group
      else if (from === pvxcommunity) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${num_split}\nhttps://pvxcommunity.com/\n\nSend ${prefix}rules to know all PVX rules.\nIf you're new to PVX, please share how did you find us.`,
            mentions: [numJid],
          },
          {
            quoted: {
              key: {
                remoteJid: from,
                fromMe: false,
                id: "710B5CF29EE7471fakeid",
                participant: "0@s.whatsapp.net",
              },
              messageTimestamp: 1671784177,
              pushName: "WhatsApp",
              message: { conversation: "WELCOME TO PVX COMMUNITY" },
            },
          }
        );
      }
      //for mano
      else if (from === pvxmano) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${num_split}🔥\n\n1) Send videos regularly especially new members.\n2) Don't Send CP or any other illegal videos.\n 3) A group bot will be counting the number of videos you've sent.\nSend ${prefix}pvxv to know video count.\nInactive members will be kicked time to time.`,
            mentions: [numJid],
          },
          {
            quoted: {
              key: {
                remoteJid: from,
                fromMe: false,
                id: "710B5CF29EE7471fakeid",
                participant: "0@s.whatsapp.net",
              },
              messageTimestamp: 1671784177,
              pushName: "WhatsApp",
              message: { conversation: "WELCOME TO PVX MANORANJAN" },
            },
          }
        );
      }
      //for programmer group
      else if (from === pvxprogrammer) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${num_split}\nhttps://pvxcommunity.com/\n\n*Kindly give your intro like*\nName:\nCollege/Degree:\nInterest:\nSkills:\nCompany(if working):`,
            mentions: [numJid],
          },
          {
            quoted: {
              key: {
                remoteJid: from,
                fromMe: false,
                id: "710B5CF29EE7471fakeid",
                participant: "0@s.whatsapp.net",
              },
              messageTimestamp: 1671784177,
              pushName: "WhatsApp",
              message: { conversation: "WELCOME TO PVX PROGRAMMERS" },
            },
          }
        );
      }
      //for sticker group
      else if (from === pvxsticker) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${num_split}\nhttps://pvxcommunity.com/\n\n1) Don't make any type of sticker that targets any caste, community, religion, sex, creed, etc.\n2) The use of any kind of 18+ media (be it nudes or semi nudes) is not allowed.\n3) Every sticker you make here gets PVX branding in it along with website, so You'll get instant ban on disobeying any rule`,
            mentions: [numJid],
          },
          {
            quoted: {
              key: {
                remoteJid: from,
                fromMe: false,
                id: "710B5CF29EE7471fakeid",
                participant: "0@s.whatsapp.net",
              },
              messageTimestamp: 1671784177,
              pushName: "WhatsApp",
              message: { conversation: "WELCOME TO PVX STICKER" },
            },
          }
        );
      }
    }
  } catch (err) {
    await LoggerBot(bot, "memberAddCheck", err, undefined);
  }
};
