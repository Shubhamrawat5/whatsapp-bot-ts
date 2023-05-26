import Parser from "rss-parser";
const parser = new Parser();
import { LoggerBot } from "./loggerBot";
import { Bot } from "../interface/Bot";
import { storeNewsStudy } from "../db/postStudyDB";

export const postStudyInfo = async (bot: Bot, pvxstudy: string) => {
  try {
    // "https://www.thehindu.com/news/national/feeder/default.rss"
    // "https://timesofindia.indiatimes.com/rssfeedmostrecent.cms"
    // "https://zeenews.india.com/rss/india-national-news.xml"
    let feed = await parser.parseURL(
      "https://www.mid-day.com/Resources/midday/rss/india-news.xml"
    );

    let li = feed.items.map((item) => {
      return { title: item.title, link: item.link };
    });

    let res = false;
    let count = 1;

    while (!res) {
      console.log(`STUDY NEWS FUNCTION ${count} times!`);
      if (count > 10) {
        //10 times, already posted news comes up
        return;
      }

      let index = Math.floor(Math.random() * li.length);
      let { title } = li[index];

      if (!title) title = "";

      res = await storeNewsStudy(title);
      if (res) {
        console.log("NEW STUDY NEWS!");
        await bot.sendMessage(pvxstudy, { text: `📰 ${title}` });
      } else {
        console.log("OLD STUDY NEWS!");
        count += 1;
      }
    }
  } catch (err) {
    await LoggerBot(bot, "STUDY-NEWS", err, undefined);
  }
};
