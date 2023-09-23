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
    await reply(`❌ URL is empty! \nSend ${prefix}yta url`);
    return;
  }
  const urlYt = args[0];
  if (!urlYt.startsWith("http")) {
    await reply(`❌ Give youtube link!`);
    return;
  }
  const infoYt = await ytdl.getInfo(urlYt);
  // 60 MIN
  if (Number(infoYt.videoDetails.lengthSeconds) >= 3600) {
    await reply(`❌ Cannot download! Audio duration limit: 60 min`);
    return;
  }
  const titleYt = infoYt.videoDetails.title;
  const randomFileName = getRandomFileName(".mp3");

  const stream = ytdl(urlYt, {
    filter: (info) => info.audioBitrate === 160 || info.audioBitrate === 128,
  }).pipe(fs.createWriteStream(`./${randomFileName}`));
  console.log("Audio downloading ->", urlYt);
  // await reply("Downloading.. This may take upto 5 min!");
  await new Promise((resolve, reject) => {
    stream.on("error", reject);
    stream.on("finish", resolve);
  });

  const stats = fs.statSync(`./${randomFileName}`);
  const fileSizeInBytes = stats.size;
  // Convert the file size to megabytes (optional)
  const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
  console.log(`Audio downloaded ! Size: ${fileSizeInMegabytes}`);
  if (fileSizeInMegabytes <= 100) {
    await bot.sendMessage(
      from,
      {
        document: fs.readFileSync(`./${randomFileName}`),
        fileName: `${titleYt}.mp3`,
        mimetype: "audio/mpeg",
      },
      { quoted: msg }
    );
  } else {
    await reply(`❌ Cannot download! Audio size limit: 100 mb`);
  }

  fs.unlinkSync(`./${randomFileName}`);
};

const yta = () => {
  const cmd = ["yta"];

  return { cmd, handler };
};

export default yta;
