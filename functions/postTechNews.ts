import axios from "axios";
const { storeNewsTech } = require("../db/postTechDB");
import { LoggerBot } from "./loggerBot";
import { Bot } from "../interface/Bot";
require("dotenv").config();

const newsapi = process.env.newsapi;
let countNews = 0;

export const postTechNews = async (bot: Bot, pvxtech: string) => {
  try {
    countNews += 1;
    if (countNews % 2 === 0) {
      let url =
        "https://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=" +
        newsapi;

      interface Articles {
        title: string;
        description: string;
        url: string;
        source: {
          name: string;
        };
      }

      let response = await axios.get(url);
      let data = response.data;
      const articles: Articles[] = data.articles;

      let res = false;
      let count = 1;

      while (!res) {
        console.log(`TECH NEWS FUNCTION: ${count} times!`);
        if (count > 10) {
          //10 times, already posted news comes up
          return;
        }

        let index = Math.floor(Math.random() * articles.length);
        let { title, description, url, source } = articles[index];

        let found = title.lastIndexOf("-");
        if (found != -1) title = title.slice(0, title.lastIndexOf("-") - 1);

        res = source.name != "Sportskeeda" && (await storeNewsTech(title));
        if (res) {
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
      let url = "https://pvx-api-vercel.vercel.app/api/news";
      let { data } = await axios.get(url);
      delete data["about"];

      let newsWeb = [
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
        console.log(`TECH NEWS FUNCTION: ${count} times!`);
        if (count > 10) {
          //10 times, already posted news comes up
          return;
        }

        let randomWeb = newsWeb[Math.floor(Math.random() * newsWeb.length)]; //random website
        let index = Math.floor(Math.random() * data[randomWeb].length);
        let news = data[randomWeb][index];

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
