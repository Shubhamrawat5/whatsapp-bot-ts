import axios from "axios";
import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

const getQuote = async (): Promise<string | undefined> => {
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
    if (err instanceof Error) {
      return err.stack;
    }
  }

  return undefined;
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
