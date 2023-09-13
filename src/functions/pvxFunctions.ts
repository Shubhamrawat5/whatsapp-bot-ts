import { ownerNumberWithJid } from "../utils/config";
import { pvxgroups } from "../utils/constants";
import { deleteOldNews } from "../db/newsDB";
import { Bot } from "../interfaces/Bot";
import checkTodayBday from "./checkTodayBday";
import { getIndianDateTime, getOldIndianDateTime } from "./getIndianDateTime";
import postStudyInfo from "./postStudyInfo";
import { postTechNewsHeadline, postTechNewsList } from "./postTechNews";

const pvxFunctions = async (bot: Bot) => {
  let usedDate = getIndianDateTime().toDateString();

  return setInterval(async () => {
    console.log("SET INTERVAL.");
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
  }, 1000 * 60 * 30); // 30 min
};

export default pvxFunctions;
