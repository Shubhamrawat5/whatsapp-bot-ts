import { PREFIX, pvxgroups } from "../utils/constants";
import { getBlacklist } from "../db/blacklistDB";
import { Bot } from "../interfaces/Bot";

import { loggerBot, sendLogToOwner } from "../utils/logger";

const addMemberCheck = async (
  bot: Bot,
  from: string,
  lidSplit: string,
  memberlid: string,
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
      const getBlacklistRes = await getBlacklist(memberlid); // TODO: NO LONGER WORKS WITH LID
      if (getBlacklistRes.length) {
        await bot.groupParticipantsUpdate(from, [memberlid], "remove");
        const { reason, adminname } = getBlacklistRes[0];
        await bot.sendMessage(from, {
          text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nNumber is blacklisted !!!!\nReason: ${reason}\nGiven by ${adminname}`,
        });

        await sendLogToOwner(
          bot,
          `${lidSplit} is removed from ${groupSubject}. Blacklisted!`
        );
        return;
      }

      // if (!lidSplit.startsWith("91")) {
      //   // const groups = [
      //   //   pvxstickeronly1,
      //   //   pvxstickeronly2,
      //   //   pvxbotcommands,
      //   //   pvxtechonly,
      //   // ];
      //   // if (groups.includes(from)) {
      //   //   return;
      //   // }

      //   await bot.sendMessage(from, {
      //     text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nOnly +91 numbers are allowed !!!!`,
      //   });
      //   await bot.groupParticipantsUpdate(from, [numJid], "remove");

      //   await sendLogToOwner(
      //     bot,
      //     `${numSplit} is removed from ${groupSubject}. Not 91!`
      //   );
      // } else
      if (from === pvxmemes) {
        await bot.sendMessage(
          from,
          {
            text: `Welcome @${lidSplit}\nhttps://pvxcommunity.com/\n\n1) No offensive/disrespectful/religious content allowed.\n2) Spamming or Posting personal pictures is strictly prohibited.`,
            mentions: [memberlid],
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
            text: `Welcome @${lidSplit}\nhttps://pvxcommunity.com/\n\nWhat are you currently watching..?`,
            mentions: [memberlid],
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
            text: `Welcome @${lidSplit}\nhttps://pvxcommunity.com/\n\nSend ${PREFIX}rules to know all PVX rules.\nIf you're new to PVX, please share how did you find us.`,
            mentions: [memberlid],
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
            text: `Welcome @${lidSplit}🔥\n\n1) Send videos regularly especially new members.\n2) Don't Send CP or any other illegal videos.\n 3) A group bot will be counting the number of videos you've sent.\nSend ${PREFIX}pvxv to know video count.\nInactive members will be kicked time to time.`,
            mentions: [memberlid],
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
            text: `Welcome @${lidSplit}\nhttps://pvxcommunity.com/\n\n*Kindly give your intro like*\nName:\nCollege/Degree:\nInterest:\nSkills:\nCompany(if working):`,
            mentions: [lidSplit],
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
            text: `Welcome @${lidSplit}\nhttps://pvxcommunity.com/\n\n1) Don't make any type of sticker that targets any caste, community, religion, sex, creed, etc.\n2) The use of any kind of 18+ media (be it nudes or semi nudes) is not allowed.\n3) Every sticker you make here gets PVX branding in it along with website, so You'll get instant ban on disobeying any rule`,
            mentions: [lidSplit],
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
