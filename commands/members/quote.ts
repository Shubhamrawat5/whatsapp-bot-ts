import axios from "axios";
import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const getQuote = async () => {
  try {
    const url = "https://zenquotes.io/api/random";
    const { data } = await axios.get(url);
    const quote = `💬 ${data[0].q}`;
    // console.log(quote);
    return quote;
  } catch (err) {
    console.log(err);
    // return "❌ SOME ERROR CAME!";
    return (err as Error).stack;
  }
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const text = await getQuote();

  await reply(text);
};

const quote = () => {
  const cmd = ["quote"];

  return { cmd, handler };
};

export default quote;
