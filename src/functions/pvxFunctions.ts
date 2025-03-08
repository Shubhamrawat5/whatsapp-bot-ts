/* eslint-disable arrow-body-style */
import cron from "node-cron";
import { ownerNumberWithJid } from "../utils/config";
import { pvxgroups } from "../utils/constants";
import { deleteOldNews } from "../db/newsDB";
import { Bot } from "../interfaces/Bot";
import checkTodayBday from "./checkTodayBday";
import { getOldIndianDateTime } from "./getIndianDateTime";
import { postTechNewsHeadline, postTechNewsList } from "./postTechNews";
import { sendLogToOwner } from "../utils/logger";
import {
  deleteCountMemberToday,
  getCountGroupsToday,
  getCountTopToday,
} from "../db/countMemberTodayDB";

// 0 0 * * * - Every day at 12:00 AM
// 30 8-23 * * * - Every hour + 30 mins, between 08:00 AM and 11:59 PM
// 0 */30 * * * * - Every 30 mins
// 0 */30 8-23 * * * - Every 30 minutes, between 08:00 AM and 11:59 PM
// 0 21 * * * - At 09:00 PM

export const postNewsCron = async (bot: Bot): Promise<cron.ScheduledTask> => {
  return cron.schedule(
    "30 8-23 * * *",
    async () => {
      await postTechNewsHeadline(bot, pvxgroups.pvxtech);
      // await postStudyInfo(bot, pvxgroups.pvxstudy);
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

export const postNewsListCron = async (
  bot: Bot
): Promise<cron.ScheduledTask> => {
  return cron.schedule(
    "0 21 * * *",
    async () => {
      await postTechNewsList(bot, pvxgroups.pvxtechonly);
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

// 11:59 PM
export const postTodayStatsCron = async (
  bot: Bot
): Promise<cron.ScheduledTask> => {
  return cron.schedule(
    "59 23 * * *",
    async () => {
      const getCountTopRes = await getCountTopToday(5);
      let countGroupMsgTop = `*📛 TOP MEMBERS STATS 📛*\n`;

      getCountTopRes.forEach((member, index) => {
        countGroupMsgTop += `\n${index + 1}) ${member.name} - ${
          member.message_count
        }`;
      });

      const getCountGroupsRes = await getCountGroupsToday(5);
      let countGroupMsg = `*📛 TOP GROUP STATS 📛*\n`;

      getCountGroupsRes.forEach((group) => {
        let grpName = group.gname ?? "Not Found";
        if (grpName.toUpperCase().includes("<{PVX}>")) {
          // grpName = grpName.split(" ")[1];
          grpName = grpName.replace("<{PVX}> ", "");
          countGroupMsg += `\n${group.message_count} - ${grpName}`;
        }
      });

      const message = `📛 PVX TODAY"S STATS 📛\n\n${countGroupMsgTop}\n\n${countGroupMsg}`;
      await bot.sendMessage(pvxgroups.pvxcommunity, { text: message });
      await deleteCountMemberToday();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

export const postBdayCron = async (bot: Bot): Promise<cron.ScheduledTask> => {
  return cron.schedule(
    "0 0 * * *",
    async () => {
      const checkTodayBdayRes = await checkTodayBday(
        bot,
        pvxgroups.pvxcommunity,
        true
      );
      if (!checkTodayBdayRes && ownerNumberWithJid) {
        await sendLogToOwner(bot, "❌ THERE IS SOME PROBLEM WITH BDAY INFO!");
      }

      const daysSubtract = 2;
      const oldDate = getOldIndianDateTime(daysSubtract);

      const deleteOldNewsRes = await deleteOldNews(oldDate);
      if (!deleteOldNewsRes && ownerNumberWithJid) {
        await sendLogToOwner(
          bot,
          "❌ THERE IS SOME PROBLEM WITH DELETING OLD NEWS!"
        );
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

// const pvxFunctions = async (bot: Bot): Promise<cron.ScheduledTask> => {
//   let usedDate = getIndianDateTime().toDateString();

//   return cron.schedule(
//     "0 */30 * * * *",
//     async () => {
//       console.log("Cron 20 min !");
//       const date = getIndianDateTime();
//       const todayDate = date.toDateString();

//       const hour = date.getHours();
//       if (hour >= 8) {
//         // 8 to 24 ON
//         await postTechNewsHeadline(bot, pvxgroups.pvxtech);
//         await postStudyInfo(bot, pvxgroups.pvxstudy);
//       }
//       // if (hour % 12 === 0) {
//       //   kickZeroMano(bot, pvxgroups.pvxmano);
//       // }

//       // TODO: STORE IN DB
//       if (usedDate !== todayDate) {
//         usedDate = todayDate;
//         const checkTodayBdayRes = await checkTodayBday(
//           bot,
//           pvxgroups.pvxcommunity,
//           true
//         );
//         if (!checkTodayBdayRes && ownerNumberWithJid) {
//           await bot.sendMessage(ownerNumberWithJid, {
//             text: "❌ THERE IS SOME PROBLEM WITH BDAY INFO!",
//           });
//         }

//         const daysSubtract = 2;
//         const oldDate = getOldIndianDateTime(daysSubtract);

//         const deleteOldNewsRes = await deleteOldNews(oldDate);
//         if (!deleteOldNewsRes && ownerNumberWithJid) {
//           await bot.sendMessage(ownerNumberWithJid, {
//             text: "❌ THERE IS SOME PROBLEM WITH DELETING OLD NEWS!",
//           });
//         }
//       }
//     },
//     {
//       scheduled: true,
//       timezone: "Asia/Kolkata",
//     }
//   );
// };

// export default pvxFunctions;
