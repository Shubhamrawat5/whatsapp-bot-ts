import { LoggerBot } from "./loggerBot";
import mongoose from "mongoose";
const uri = process.env.uri;

//NOTE: GIVE RETURN TYPE IN ALL FUNCTIONS
const getBdayData = async () => {
  if (!uri) return;
  mongoose.connect(uri);

  // Collection schema
  const bday_schema = new mongoose.Schema({
    name: String,
    username: String,
    date: Number,
    month: Number,
    year: Number,
    numb: Number,
    place: String,
  });

  interface Bday {
    name: string | undefined;
    username: string | undefined;
    date: number | undefined;
    month: number | undefined;
    year?: number | undefined;
    numb: number | undefined;
    place: string | undefined;
  }

  const Birthday = mongoose.model("birthdays", bday_schema);

  const data = await Birthday.find().sort({ date: 1 }); //sort by date

  let bday: Bday[] = [];
  data.forEach((document) => {
    let { name, username, date, month, place, numb } = document;
    bday.push({
      name,
      username,
      date,
      month,
      place,
      numb,
    });

    // bday = [{},{},{},{},{}]
  });

  return bday;
};

export const checkTodayBday = async (
  bot: any,
  todayDate: string,
  pvxcommunity: string
): Promise<void> => {
  // const checkTodayBday = async (todayDate) => {
  try {
    console.log("CHECKING TODAY BDAY...", todayDate);
    // DB connect

    const todayDateArr = todayDate.split("/");
    let date = todayDateArr[0];
    date = date.startsWith("0") ? date[1] : date; //05 so take 5
    let month = todayDateArr[1];
    month = month.startsWith("0") ? month[1] : month; //05 so take 5
    const data = await getBdayData();
    if (!data) {
      //TODO: USE log, error, warn everywhere
      console.log("THERE IS SOME PROBLEM WITH BDAY INFO!");
      return;
    }
    // let url = "https://pvx-api-vercel.vercel.app/api/bday";
    // let { data } = await axios.get(url);

    const bday: string[] = [];
    const mentions: string[] = [];

    data.forEach((member: any) => {
      if (member.month == month && member.date == date) {
        // bday.push(
        //   `${member.name.toUpperCase()} (${member.username.toUpperCase()})`
        // );
        const number = (member.numb = "91" + member.numb);
        bday.push(`@${number}`);
        mentions.push(number + "@s.whatsapp.net");
        console.log(`Today is ${member.name} Birthday!`);
      }
    });
    if (bday.length) {
      let bdayComb = bday.join(" & ");
      try {
        await bot.groupParticipantsUpdate(pvxcommunity, mentions, "add");
      } catch (err) {
        console.log(err);
      }
      await bot.sendMessage(pvxcommunity, {
        text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nToday is ${bdayComb} Birthday 🍰 🎉🎉`,
        mentions: mentions,
      });
      console.log(
        `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nToday is ${bdayComb} Birthday 🍰 🎉🎉`
      );
      console.log(mentions);
    } else {
      console.log("NO BIRTHDAY!");
      await bot.sendMessage(pvxcommunity, {
        text: `*─「 🔥 <{PVX}> BOT 🔥 」─* \n\nThere is no Birthday today!`,
      });
    }
    await bot.groupUpdateSubject(pvxcommunity, "<{PVX}> COMMUNITY ❤️");
  } catch (err) {
    await LoggerBot(bot, "TODAY-BDAY", err, undefined);
    console.log(err);
  }
};
// let todayDate = new Date().toLocaleDateString("en-GB", {
//   timeZone: "Asia/kolkata",
// });
// checkTodayBday(todayDate);
