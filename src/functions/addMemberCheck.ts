import { prefix, pvxgroups } from "../utils/constants";
import { getBlacklist } from "../db/blacklistDB";
import { Bot } from "../interfaces/Bot";

import { loggerBot, sendLogToOwner } from "../utils/logger";

const addMemberCheck = async (
  bot: Bot,
  from: string,
  numSplit: string,
  numJid: string,
  groupSubject: string
) => {
  const {
    pvxcommunity,
    pvxprogrammer,
    pvxmano,
    pvxmovies,
    pvxsticker,
    pvxmemes,
  } = pvxgroups;
  try {
    if (groupSubject.toUpperCase().includes("<{PVX}>")) {
      // if number is blacklisted
      const getBlacklistRes = await getBlacklist(numJid);
      if (getBlacklistRes.length) {
        await bot.groupParticipantsUpdate(from, [numJid], "remove");
        const { reason, adminname } = getBlacklistRes[0];
        await bot.sendMessage(from, {
          text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nNumber is blacklisted !!!!\nReason: ${reason}\nGiven by ${adminname}`,
        });

        await sendLogToOwner(
          bot,
          `${numSplit} is removed from ${groupSubject}. Blacklisted!`
        );
        return;
      }

      if (!numSplit.startsWith("91")) {
        // const groups = [
        //   pvxstickeronly1,
        //   pvxstickeronly2,
        //   pvxbotcommands,
        //   pvxtechonly,
        // ];
        // if (groups.includes(from)) {
        //   return;
        // }

        await bot.sendMessage(from, {
          text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nOnly +91 numbers are allowed !!!!`,
        });
        await bot.groupParticipantsUpdate(from, [numJid], "remove");

        await sendLogToOwner(
          bot,
          `${numSplit} is removed from ${groupSubject}. Not 91!`
        );
      } else if (from === pvxmemes) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${numSplit}\nhttps://pvxcommunity.com/\n\n1) No offensive/disrespectful/religious content allowed.\n2) Spamming or Posting personal pictures is strictly prohibited.`,
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
              message: { conversation: "WELCOME TO PVX MEMES" },
            },
          }
        );
      } else if (from === pvxmovies) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${numSplit}\nhttps://pvxcommunity.com/\n\nWhat are you currently watching..?`,
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
      } else if (from === pvxcommunity) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${numSplit}\nhttps://pvxcommunity.com/\n\nSend ${prefix}rules to know all PVX rules.\nIf you're new to PVX, please share how did you find us.`,
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
      } else if (from === pvxmano) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${numSplit}🔥\n\n1) Send videos regularly especially new members.\n2) Don't Send CP or any other illegal videos.\n 3) A group bot will be counting the number of videos you've sent.\nSend ${prefix}pvxv to know video count.\nInactive members will be kicked time to time.`,
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
      } else if (from === pvxprogrammer) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${numSplit}\nhttps://pvxcommunity.com/\n\n*Kindly give your intro like*\nName:\nCollege/Degree:\nInterest:\nSkills:\nCompany(if working):`,
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
      } else if (from === pvxsticker) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${numSplit}\nhttps://pvxcommunity.com/\n\n1) Don't make any type of sticker that targets any caste, community, religion, sex, creed, etc.\n2) The use of any kind of 18+ media (be it nudes or semi nudes) is not allowed.\n3) Every sticker you make here gets PVX branding in it along with website, so You'll get instant ban on disobeying any rule`,
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
    // TODO: CHECK THIS UNDEFINED PASSING
    await loggerBot(bot, "addMemberCheck", err, undefined);
  }
};

export default addMemberCheck;

// for study group
// if (from === pvxstudy) {
//   await bot.sendMessage(
//     from,
//     {
//       text: `Welcome @${numSplit}\nhttps://pvxcommunity.com/\n\nKindly fill the Biodata form (mandatory for all)\n\n👇🏻👇🏻👇🏻👇🏻👇🏻\nhttps://forms.gle/uuvUwV5fTk8JAjoTA`,
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
