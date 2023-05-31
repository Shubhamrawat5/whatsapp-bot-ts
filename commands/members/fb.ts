import axios from "axios";
import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

export const fb = () => {
  return { cmd: ["fb", "facebook"], handler: handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, args, reply, from } = msgInfoObj;
  if (args.length === 0) {
    await reply(`❌ URL is empty! \nSend ${prefix}fb url`);
    return;
  }

  const urlFb = args[0];
  console.log(urlFb);

  try {
    const res = await axios.get(
      "https://fantox001-scrappy-api.vercel.app/fbdl?url=" + urlFb
    );

    await bot.sendMessage(
      from,
      {
        video: { url: res.data.videoUrl },
      },
      { quoted: msg, mediaUploadTimeoutMs: 1000 * 60 }
    );
  } catch (err) {
    await reply(
      `${(
        err as Error
      ).toString()}\n\nNote: only public fb videos can be downloaded!`
    );
  }
};
