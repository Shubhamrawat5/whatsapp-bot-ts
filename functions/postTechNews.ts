import axios from "axios";
import { LoggerBot } from "./loggerBot";
import { Bot } from "../interface/Bot";
import { storeNewsTech } from "../db/postTechDB";
import "dotenv/config";
import { getTechNews } from "./getTechNews";

const { newsapi } = process.env;
let countNews = 0;

export const postTechNewsHeadline = async (bot: Bot, pvxtech: string) => {
  try {
    countNews += 1;
    if (countNews % 2 === 0) {
      const url = `https://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=${newsapi}`;

      interface Articles {
        title: string;
        description: string;
        url: string;
        source: {
          name: string;
        };
      }

      const response = await axios.get(url);
      const { data } = response;
      const { articles } = data;

      let storeNewsTechRes = false;
      let count = 1;

      while (!storeNewsTechRes) {
        console.log(`TECH NEWS FUNCTION: ${count} times!`);
        if (count > 10) {
          // 10 times, already posted news comes up
          return;
        }

        const index = Math.floor(Math.random() * articles.length);
        const { url, source } = articles[index];
        let { title } = articles[index];

        const found = title.lastIndexOf("-");
        if (found != -1) title = title.slice(0, title.lastIndexOf("-") - 1);

        storeNewsTechRes =
          source.name != "Sportskeeda" && (await storeNewsTech(title));
        if (storeNewsTechRes) {
          console.log("NEW TECH NEWS!");

          let message = `📰 ${title}\n`;
          // if (description) message += `\n_${description}_`;
          if (url) message += `\nSource: ${url}`;

          await bot.sendMessage(pvxtech, {
            text: message,
          });
        } else {
          console.log("OLD TECH NEWS!");
          count += 1;
        }
      }
    } else {
      const url = "https://pvx-api-vercel.vercel.app/api/news";
      const { data } = await axios.get(url);
      delete data.about;

      const newsWeb = [
        "gadgets-ndtv",
        "gadgets-now",
        "inshorts",
        "beebom",
        "mobile-reuters",
        "techcrunch",
        "engadget",
      ];

      let res = false;
      let count = 1;

      while (!res) {
        if (count > 10) {
          // 10 times, already posted news comes up
          return;
        }
        console.log(`TECH NEWS FUNCTION: ${count} times!`);

        const randomWeb = newsWeb[Math.floor(Math.random() * newsWeb.length)]; // random website

        if (!data[randomWeb]) {
          // undefined
          count += 1;
          continue;
        }

        const index = Math.floor(Math.random() * data[randomWeb].length);
        const news = data[randomWeb][index];

        res = await storeNewsTech(news);
        if (res) {
          console.log("NEW TECH NEWS!");
          await bot.sendMessage(pvxtech, { text: `📰 ${news}` });
        } else {
          console.log("OLD TECH NEWS!");
          count += 1;
        }
      }
    }
  } catch (err) {
    await LoggerBot(bot, "TECH-NEWS", err, undefined);
  }
};

export const postTechNewsList = async (bot: Bot, pvxtechonly: string) => {
  try {
    const news = await getTechNews();
    await bot.sendMessage(pvxtechonly, { text: `📰 ${news}` });
  } catch (err) {
    await LoggerBot(bot, "TECH-NEWS-LIST", err, undefined);
  }
};
