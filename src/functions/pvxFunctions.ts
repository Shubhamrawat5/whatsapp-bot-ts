/* eslint-disable arrow-body-style */
import cron from "node-cron";
import { ownerNumberWithJid } from "../utils/config";
import { pvxgroups } from "../utils/constants";
import { deleteOldNews } from "../db/newsDB";
import { Bot } from "../interfaces/Bot";
import checkTodayBday from "./checkTodayBday";
import { getIndianDateTime, getOldIndianDateTime } from "./getIndianDateTime";
import postStudyInfo from "./postStudyInfo";
import { postTechNewsHeadline, postTechNewsList } from "./postTechNews";

// 0 0 * * * - Every day at 12:00 AM
// 0 */30 * * * * - Every 30 mins
// 0 */30 8-23 * * * - Every 30 minutes, between 08:00 AM and 11:59 PM
// 0 21 * * * - At 09:00 PM

export const postNewsCron = async (bot: Bot): Promise<cron.ScheduledTask> => {
  return cron.schedule(
    "0 */30 8-23 * * *",
    async () => {
      await postTechNewsHeadline(bot, pvxgroups.pvxtech);
      await postStudyInfo(bot, pvxgroups.pvxstudy);
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
        await bot.sendMessage(ownerNumberWithJid, {
          text: "❌ THERE IS SOME PROBLEM WITH BDAY INFO!",
        });
      }

      const daysSubtract = 2;
      const oldDate = getOldIndianDateTime(daysSubtract);

      const deleteOldNewsRes = await deleteOldNews(oldDate);
      if (!deleteOldNewsRes && ownerNumberWithJid) {
        await bot.sendMessage(ownerNumberWithJid, {
          text: "❌ THERE IS SOME PROBLEM WITH DELETING OLD NEWS!",
        });
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

const pvxFunctions = async (bot: Bot): Promise<cron.ScheduledTask> => {
  let usedDate = getIndianDateTime().toDateString();

  return cron.schedule(
    "0 */30 * * * *",
    async () => {
      console.log("Cron 20 min !");
      const date = getIndianDateTime();
      const todayDate = date.toDateString();

      const hour = date.getHours();
      if (hour === 25) {
        // 9 PM
        await postTechNewsList(bot, pvxgroups.pvxtechonly);
      }
      if (hour >= 8) {
        // 8 to 24 ON
        await postTechNewsHeadline(bot, pvxgroups.pvxtech);
        await postStudyInfo(bot, pvxgroups.pvxstudy);
      }
      // if (hour % 12 === 0) {
      //   kickZeroMano(bot, pvxgroups.pvxmano);
      // }

      // TODO: STORE IN DB
      if (usedDate !== todayDate) {
        usedDate = todayDate;
        const checkTodayBdayRes = await checkTodayBday(
          bot,
          pvxgroups.pvxcommunity,
          true
        );
        if (!checkTodayBdayRes && ownerNumberWithJid) {
          await bot.sendMessage(ownerNumberWithJid, {
            text: "❌ THERE IS SOME PROBLEM WITH BDAY INFO!",
          });
        }

        const daysSubtract = 2;
        const oldDate = getOldIndianDateTime(daysSubtract);

        const deleteOldNewsRes = await deleteOldNews(oldDate);
        if (!deleteOldNewsRes && ownerNumberWithJid) {
          await bot.sendMessage(ownerNumberWithJid, {
            text: "❌ THERE IS SOME PROBLEM WITH DELETING OLD NEWS!",
          });
        }
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};

export default pvxFunctions;
