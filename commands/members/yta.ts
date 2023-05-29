import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import ytdl from "ytdl-core";
import fs from "fs";
import { getRandomFileName } from "../../functions/getRandomFileName";

export const yta = () => {
  const cmd = ["yta"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply, args, from } = msgInfoObj;
  try {
    if (args.length === 0) {
      await reply(`❌ URL is empty! \nSend ${prefix}yta url`);
      return;
    }
    const urlYt = args[0];
    if (!urlYt.startsWith("http")) {
      await reply(`❌ Give youtube link!`);
      return;
    }
    const infoYt = await ytdl.getInfo(urlYt);
    //30 MIN
    if (Number(infoYt.videoDetails.lengthSeconds) >= 1800) {
      await reply(`❌ Video too big!`);
      return;
    }
    const titleYt = infoYt.videoDetails.title;
    const randomName = getRandomFileName(".mp3");

    const stream = ytdl(urlYt, {
      filter: (info) => info.audioBitrate == 160 || info.audioBitrate == 128,
    }).pipe(fs.createWriteStream(`./${randomName}`));
    console.log("Audio downloading ->", urlYt);
    // await reply("Downloading.. This may take upto 5 min!");
    await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", resolve);
    });

    const stats = fs.statSync(`./${randomName}`);
    const fileSizeInBytes = stats.size;
    // Convert the file size to megabytes (optional)
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    console.log("Audio downloaded ! Size: " + fileSizeInMegabytes);
    if (fileSizeInMegabytes <= 40) {
      await bot.sendMessage(
        from,
        {
          document: fs.readFileSync(`./${randomName}`),
          fileName: titleYt + ".mp3",
          mimetype: "audio/mpeg",
        },
        { quoted: msg }
      );
    } else {
      await reply(`❌ File size bigger than 40mb.`);
    }

    fs.unlinkSync(`./${randomName}`);
  } catch (err) {
    console.log(err);
    await reply((err as Error).toString());
  }
};
