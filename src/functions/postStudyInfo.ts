import Parser from "rss-parser";
import { LoggerBot } from "./loggerBot";
import { Bot } from "../interface/Bot";
import { storeNewsStudy } from "../db/postStudyDB";

const postStudyInfo = async (bot: Bot, pvxstudy: string) => {
  try {
    const parser = new Parser();

    // "https://www.thehindu.com/news/national/feeder/default.rss"
    // "https://timesofindia.indiatimes.com/rssfeedmostrecent.cms"
    // "https://zeenews.india.com/rss/india-national-news.xml"
    const feed = await parser.parseURL(
      "https://www.mid-day.com/Resources/midday/rss/india-news.xml"
    );

    const li = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
    }));

    let storeNewsStudyRes = false;
    let count = 1;

    while (!storeNewsStudyRes) {
      if (count > 10) {
        // 10 times, already posted news comes up
        return;
      }
      console.log(`STUDY NEWS FUNCTION ${count} times!`);

      const index = Math.floor(Math.random() * li.length);
      let { title } = li[index];

      if (!title) title = "";

      // eslint-disable-next-line no-await-in-loop
      storeNewsStudyRes = await storeNewsStudy(title);
      if (storeNewsStudyRes) {
        console.log("NEW STUDY NEWS!");
        // eslint-disable-next-line no-await-in-loop
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

export default postStudyInfo;
