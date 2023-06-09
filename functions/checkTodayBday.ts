import { Bot } from "../interface/Bot";
import { LoggerBot } from "./loggerBot";
import mongoose from "mongoose";

interface Bday {
  name: string | undefined;
  username: string | undefined;
  date: number | undefined;
  month: number | undefined;
  year?: number | undefined;
  numb: number | undefined;
  place: string | undefined;
}

const getBdayData = async () => {
  const uri = process.env.uri;

  if (!uri) return;
  const connection = await mongoose.connect(uri);

  // Collection schema
  const bday_schema = new connection.Schema({
    name: String,
    username: String,
    date: Number,
    month: Number,
    year: Number,
    numb: Number,
    place: String,
  });

  const Birthday = connection.model("birthdays", bday_schema);

  const data = await Birthday.find().sort({ date: 1 }); //sort by date

  await connection.disconnect();
  connection.deleteModel("birthdays");

  const bday: Bday[] = [];
  data.forEach((document) => {
    const { name, username, date, month, place, numb } = document;
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
  bot: Bot,
  pvxcommunity: string
): Promise<void> => {
  // const checkTodayBday = async (todayDate) => {
  try {
    const todayDate = new Date().toLocaleDateString("en-GB", {
      timeZone: "Asia/kolkata",
    });
    console.log("CHECKING TODAY BDAY...", todayDate);
    // DB connect

    const todayDateArr = todayDate.split("/");
    const date = Number(todayDateArr[0]);
    const month = Number(todayDateArr[1]);
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

    data.forEach((member: Bday) => {
      if (member.month == month && member.date == date) {
        // bday.push(
        //   `${member.name.toUpperCase()} (${member.username.toUpperCase()})`
        // );
        const number = `91${member.numb}`;
        bday.push(`@${number}`);
        mentions.push(number + "@s.whatsapp.net");
        console.log(`Today is ${member.name} Birthday!`);
      }
    });
    if (bday.length) {
      const bdayComb = bday.join(" & ");
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
