import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import axios from "axios";
import fs from "fs";
import { getRandomFileName } from "../../functions/getRandomFileName";

const downloadSong = async (randomName: string, query: string) => {
  try {
    const INFO_URL = "https://slider.kz/vk_auth.php?q=";
    // const DOWNLOAD_URL = "https://slider.kz/download/";
    let { data } = await axios.get(INFO_URL + query);

    if (data["audios"][""].length <= 1) {
      console.log("==[ SONG NOT FOUND! ]==");
      return { info: "NF" };
    }

    //avoid remix,revisited,mix
    let i = 0;
    let track = data["audios"][""][i];
    while (/remix|revisited|mix/i.test(track.tit_art)) {
      i += 1;
      track = data["audios"][""][i];
    }
    //if reach the end then select the first song
    if (!track) {
      track = data["audios"][""][0];
    }

    // let link = DOWNLOAD_URL + track.id + "/";
    // link = link + track.duration + "/";
    // link = link + track.url + "/";
    // link = link + track.tit_art + ".mp3" + "?extra=";
    // link = link + track.extra;
    let link = track.url;
    link = encodeURI(link); //to replace unescaped characters from link

    let songName = track.tit_art;
    songName =
      songName =
      songName =
        songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name
    // console.log(link);
    // download(songName, link);
    const res = await axios({
      method: "GET",
      url: link,
      responseType: "stream",
    });
    data = res.data;
    const path = `./${randomName}`;
    const writer = fs.createWriteStream(path);
    data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(songName));
      writer.on("error", () => reject);
    });
  } catch (err) {
    console.log(err);
    return { info: "ERR", err: (err as Error).stack };
  }
};

export const song = () => {
  const cmd = ["song"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply, args, from } = msgInfoObj;

  if (args.length === 0) {
    await reply(`❌ Query is empty! \nSend ${prefix}song query`);
    return;
  }
  const randomName = getRandomFileName(".mp3");
  const query = args.join("%20");
  const response: any = await downloadSong(randomName, query);
  if (response && response.info == "NF") {
    await reply(
      `❌ Song not found!\nTry to put correct spelling of song along with singer name.\n[Better use ${prefix}yta command to download correct song from youtube]`
    );
    return;
  }
  if (response && response.info === "ERR") {
    await reply(response.err);
    return;
  }
  console.log(`song saved-> ./${randomName}`, response);

  await bot.sendMessage(
    from,
    {
      document: fs.readFileSync(`./${randomName}`),
      fileName: response + ".mp3",
      mimetype: "audio/mpeg",
    },
    { quoted: msg, mediaUploadTimeoutMs: 1000 * 30 }
  );
  fs.unlinkSync(`./${randomName}`);
};
