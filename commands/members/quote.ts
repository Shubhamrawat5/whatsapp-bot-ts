import axios from "axios";
import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

const getQuote = async () => {
  try {
    let url = "https://zenquotes.io/api/random";
    let { data } = await axios.get(url);
    let quote = "💬 " + data[0].q;
    // console.log(quote);
    return quote;
  } catch (err) {
    console.log(err);
    // return "❌ SOME ERROR CAME!";
    return (err as Error).stack;
  }
};

export const command = () => {
  return { cmd: ["quote"], handler: handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  let text = await getQuote();

  await reply(text);
};
