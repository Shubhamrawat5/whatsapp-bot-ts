import axios from "axios";
import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { args, reply, from } = msgInfoObj;
  if (args.length === 0) {
    await reply(`❌ URL is empty! \nSend ${prefix}fb url`);
    return;
  }

  const urlFb = args[0];
  console.log(urlFb);

  try {
    const res = await axios.get(
      `https://fantox001-scrappy-api.vercel.app/fbdl?url=${urlFb}`
    );

    await bot.sendMessage(
      from,
      {
        video: { url: res.data.videoUrl },
      },
      { quoted: msg, mediaUploadTimeoutMs: 1000 * 60 }
    );
  } catch (err) {
    if (err instanceof Error) {
      await reply(err.toString());
    }
  }
};

const fb = () => {
  const cmd = ["fb", "facebook"];

  return { cmd, handler };
};

export default fb;
