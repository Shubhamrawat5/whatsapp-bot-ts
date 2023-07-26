import { getbday } from "../db/bdayDB";
import { Bot } from "../interface/Bot";
import { loggerBot } from "../utils/logger";
import { getCurrentIndianDate } from "./getDateTime";

const checkTodayBday = async (
  bot: Bot,
  groupjid: string,
  addMember: boolean
): Promise<boolean> => {
  try {
    const today = getCurrentIndianDate();
    console.log("CHECKING TODAY BDAY...", today);
    // DB connect

    const todayArr = today.split("/");
    const todayDate = Number(todayArr[0]);
    const todayMonth = Number(todayArr[1]);

    // let url = "https://pvx-api-vercel.vercel.app/api/bday";
    // let { data } = await axios.get(url);

    const data = await getbday();
    if (data.length === 0) {
      // TODO: USE log, error, warn everywhere
      console.log("THERE IS SOME PROBLEM WITH BDAY INFO!");
      return false;
    }

    const bday: string[] = [];
    const mentions: string[] = [];

    data.forEach((member) => {
      if (member.month === todayMonth && member.date === todayDate) {
        // bday.push(
        //   `${member.name.toUpperCase()} (${member.username.toUpperCase()})`
        // );
        bday.push(`@${member.number} ${member.username}`);
        mentions.push(`${member.number}@s.whatsapp.net`);
        console.log(`Today is ${member.name} Birthday!`);
      }
    });
    if (bday.length) {
      const bdayCombine = bday.join(" & ");
      if (addMember) {
        try {
          await bot.groupParticipantsUpdate(groupjid, mentions, "add");
        } catch (err) {
          console.log(err);
        }
      }
      const text = `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nToday is ${bdayCombine} Birthday 🍰 🎉🎉`;
      await bot.sendMessage(groupjid, { text, mentions });
      console.log(text);
      console.log(mentions);
    } else {
      console.log("NO BIRTHDAY!");
      await bot.sendMessage(groupjid, {
        text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nThere is no Birthday today!`,
      });
    }
    if (addMember) {
      await bot.groupUpdateSubject(groupjid, "<{PVX}> COMMUNITY ❤️");
    }
    return true;
  } catch (err) {
    await loggerBot(bot, "TODAY-BDAY", err, undefined);
    console.log(err);
    return false;
  }
};

export default checkTodayBday;
