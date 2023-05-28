import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import axios from "axios";

const getNews = async () => {
  try {
    const url = "https://pvx-api-vercel.vercel.app/api/news";
    const { data } = await axios.get(url);

    let msg = `☆☆💥 Tech News 💥☆☆`;
    const inshorts = data.inshorts;
    let count = 0; //for first 14 news only
    for (let i = 0; i < inshorts.length; ++i) {
      ++count;
      if (count === 15) break;
      msg += `\n\n🌐 ${inshorts[i]}`;
    }
    msg += `\n\njoin t.me/pvxtechnews for daily tech news!`;
    return msg;
  } catch (err) {
    console.log(err);
    // return "❌ SOME ERROR CAME!";
    return (err as Error).toString();
  }
};

export const command = () => {
  const cmd = ["technews", "tn"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from } = msgInfoObj;

  const text = await getNews();

  await bot.sendMessage(from, { text }, { quoted: msg });
};
