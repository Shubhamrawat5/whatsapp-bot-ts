import axios from "axios";
import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const getQuote = async () => {
  try {
    interface Quote {
      q: string;
      a: string;
      h: string;
    }

    const url = "https://zenquotes.io/api/random";
    const { data } = await axios.get<Quote[]>(url);
    const quote = `💬 ${data[0].q}`;

    return quote;
  } catch (err) {
    console.log(err);
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
