import { WAMessage } from "@whiskeysockets/baileys";
import ytdl from "ytdl-core";
import fs from "fs";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import getRandomFileName from "../../functions/getRandomFileName";
import { prefix } from "../../constants/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, from } = msgInfoObj;

  try {
    if (args.length === 0) {
      await reply(`❌ URL is empty! \nSend ${prefix}ytv url`);
      return;
    }
    const urlYt = args[0];
    if (!urlYt.startsWith("http")) {
      await reply(`❌ Give youtube link!`);
      return;
    }
    const infoYt = await ytdl.getInfo(urlYt);
    // 30 MIN
    if (Number(infoYt.videoDetails.lengthSeconds) >= 1800) {
      await reply(`❌ Video file too big!`);
      return;
    }
    const titleYt = infoYt.videoDetails.title;
    const randomFileName = getRandomFileName(".mp4");

    const stream = ytdl(urlYt, {
      filter: (info) => info.itag === 22 || info.itag === 18,
    }).pipe(fs.createWriteStream(`./${randomFileName}`));
    // 22 - 1080p/720p and 18 - 360p
    console.log("Video downloading ->", urlYt);
    // await reply("Downloading.. This may take upto 5 min!");
    await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", resolve);
    });

    const stats = fs.statSync(`./${randomFileName}`);
    const fileSizeInBytes = stats.size;
    // Convert the file size to megabytes (optional)
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    console.log(`Video downloaded ! Size: ${fileSizeInMegabytes}`);
    if (fileSizeInMegabytes <= 40) {
      await bot.sendMessage(
        from,
        {
          video: fs.readFileSync(`./${randomFileName}`),
          caption: `${titleYt}`,
        },
        { quoted: msg }
      );
    } else {
      await reply(`❌ File size bigger than 40mb.`);
    }

    fs.unlinkSync(`./${randomFileName}`);
  } catch (err) {
    console.log(err);
    await reply((err as Error).toString());
  }
};

const ytv = () => {
  const cmd = ["ytv", "yt"];

  return { cmd, handler };
};

export default ytv;
