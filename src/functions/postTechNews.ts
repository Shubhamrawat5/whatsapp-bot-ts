import axios from "axios";
import { loggerBot } from "../utils/logger";
import { Bot } from "../interfaces/Bot";
import getTechNews from "./getTechNews";
import { storeNews } from "../db/newsDB";
import { newsApiKey } from "../utils/config";

let countNews = 0;

export const postTechNewsHeadline = async (bot: Bot, pvxtech: string) => {
  try {
    countNews += 1;
    if (countNews % 2 === 0) {
      const apiUrl = `https://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=${newsApiKey}`;

      interface News {
        status: string;
        totalResults: number;
        articles: {
          description: string;
          url: string;
          source: {
            name: string;
          };
          title: string;
        }[];
      }

      const { data } = await axios.get<News>(apiUrl);
      const { articles } = data;

      let storeNewsTechRes = false;
      let count = 1;

      if (articles.length) {
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
          if (found !== -1) title = title.slice(0, title.lastIndexOf("-") - 1);

          storeNewsTechRes =
            // eslint-disable-next-line no-await-in-loop
            source.name !== "Sportskeeda" && (await storeNews(title));
          if (storeNewsTechRes) {
            console.log("NEW TECH NEWS!");

            let message = `📰 ${title}\n`;
            // if (description) message += `\n_${description}_`;
            if (url) message += `\nSource: ${url}`;

            // eslint-disable-next-line no-await-in-loop
            await bot.sendMessage(pvxtech, {
              text: message,
            });
          } else {
            console.log("OLD TECH NEWS!");
            count += 1;
          }
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

      let storeNewsTechRes = false;
      let count = 1;

      while (!storeNewsTechRes) {
        if (count > 10) {
          // 10 times, already posted news comes up
          return;
        }
        console.log(`TECH NEWS FUNCTION: ${count} times!`);

        const randomWeb = newsWeb[Math.floor(Math.random() * newsWeb.length)]; // random website

        if (data[randomWeb]) {
          const index = Math.floor(Math.random() * data[randomWeb].length);
          const news = data[randomWeb][index];

          // eslint-disable-next-line no-await-in-loop
          storeNewsTechRes = await storeNews(news);
          if (storeNewsTechRes && !news.startsWith("Error")) {
            console.log("NEW TECH NEWS!");
            // eslint-disable-next-line no-await-in-loop
            await bot.sendMessage(pvxtech, { text: `📰 ${news}` });
          } else {
            console.log("OLD TECH NEWS!");
            count += 1;
          }
        } else {
          count += 1;
        }
      }
    }
  } catch (err) {
    await loggerBot(bot, "TECH-NEWS", err, undefined);
  }
};

export const postTechNewsList = async (bot: Bot, pvxtechonly: string) => {
  try {
    const news = await getTechNews();
    await bot.sendMessage(pvxtechonly, { text: `📰 ${news}` });
  } catch (err) {
    await loggerBot(bot, "TECH-NEWS-LIST", err, undefined);
  }
};
