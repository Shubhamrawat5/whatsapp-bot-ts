const axios = require("axios");
import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

export const command = () => {
  return { cmd: ["fb", "facebook"], handler: handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { prefix, args, reply, from } = msgInfoObj;
  if (args.length === 0) {
    reply(`❌ URL is empty! \nSend ${prefix}fb url`);
    return;
  }

  let urlFb = args[0];
  console.log(urlFb);

  try {
    let res = await axios.get(
      "https://fantox001-scrappy-api.vercel.app/fbdl?url=" + urlFb
    );

    bot.sendMessage(
      from,
      {
        video: { url: res.data.videoUrl },
      },
      { quoted: msg, mediaUploadTimeoutMs: 1000 * 30 }
    );
  } catch (err) {
    reply(
      `${(
        err as Error
      ).toString()}\n\nNote: only public fb videos can be downloaded!`
    );
  }
};
