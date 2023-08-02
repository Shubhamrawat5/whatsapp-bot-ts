import { WAMessage } from "@whiskeysockets/baileys";
import google from "googlethis";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

import getMessage from "../../functions/getMessage";
import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, command } = msgInfoObj;

  try {
    const message = await getMessage(msg, command);

    if (!message) {
      await reply(`❌ Query is not given! \nSend ${prefix}google query`);
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
    if (err instanceof Error) {
      await reply(err.toString());
    }
  }
};

const gs = () => {
  const cmd = ["google", "search", "gs"];

  return { cmd, handler };
};

export default gs;
