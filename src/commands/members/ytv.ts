import { WAMessage } from "@whiskeysockets/baileys";
import ytdl from "ytdl-core";
import fs from "fs";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

import getRandomFileName from "../../functions/getRandomFileName";
import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, from } = msgInfoObj;

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
  // 60 min
  if (Number(infoYt.videoDetails.lengthSeconds) >= 3600) {
    await reply(`❌ Cannot download! Video duration limit: 60 min`);
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
  if (fileSizeInMegabytes <= 100) {
    await bot.sendMessage(
      from,
      {
        video: fs.readFileSync(`./${randomFileName}`),
        caption: `${titleYt}`,
      },
      { quoted: msg }
    );
  } else {
    await reply(`❌ Cannot download! Video size limit: 100 mb`);
  }

  fs.unlinkSync(`./${randomFileName}`);
};

const ytv = () => {
  const cmd = ["ytv", "yt"];

  return { cmd, handler };
};

export default ytv;
