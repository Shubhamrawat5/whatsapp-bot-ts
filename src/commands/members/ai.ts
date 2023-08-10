import { Configuration, OpenAIApi } from "openai";

import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";
import { openAiKey } from "../../utils/config";

const configuration = new Configuration({
  apiKey: openAiKey,
});
const openai = new OpenAIApi(configuration);

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  if (!openAiKey) {
    await reply(
      `❌ openai key is not set!\nGet key from https://platform.openai.com/account/api-keys`
    );
    return;
  }

  try {
    if (args.length === 0) {
      await reply(`❌ Query is not given! \nSend ${prefix}ai query`);
      return;
    }

    const query = args.join(" ");

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: query }],
    });
    let response =
      chatCompletion.data.choices[0].message?.content ?? "❌ NO RESPONSE!";

    if (response.length > 400) {
      response = response.slice(0, 100) + readMore + response.slice(100);
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
