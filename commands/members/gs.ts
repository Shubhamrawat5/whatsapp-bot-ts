import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import google from "googlethis";
import { getMessage } from "../../functions/getMessage";

export const gs = () => {
  return { cmd: ["google", "search", "gs"], handler: handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply, command } = msgInfoObj;

  try {
    const message = await getMessage(msg, prefix, command);

    if (!message) {
      const message = `❌ Query is not given! \nSend ${prefix}google query`;
      await reply(message);
      return;
    }

    const options = {
      page: 0,
      safe: false, // Safe Search
      parse_ads: false, // If set to true sponsored results will be parsed
      additional_params: {
        // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
        hl: "en",
      },
    };

    const response = await google.search(message, options);
    const { title, description, url } = response.results[0];
    const text = `*${title}*\n${description}\n\n${url}`;
    await reply(text);
  } catch (err) {
    await reply((err as Error).toString());
  }
};
