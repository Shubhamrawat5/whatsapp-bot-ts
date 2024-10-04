import { GoogleGenerativeAI } from "@google/generative-ai";

import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";
import { openAiKey } from "../../utils/config";

const genAI = new GoogleGenerativeAI(openAiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  if (!openAiKey) {
    await reply(
      `❌ Gemini key is not set!\nGet key from https://aistudio.google.com/app/apikey`
    );
    return;
  }

  try {
    if (args.length === 0) {
      await reply(`❌ Query is not given! \nSend ${prefix}ai query`);
      return;
    }

    const query = args.join(" ");

    let response = (await model.generateContent(query)).response.text();
    if (response.length > 400) {
      response = response.slice(0, 100) + readMore + response;
    }

    await reply(`AI: ${response}`);
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      await reply(err.toString());
    }
  }
};

const ai = () => {
  const cmd = ["ai"];

  return { cmd, handler };
};

export default ai;
