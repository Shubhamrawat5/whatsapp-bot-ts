import { WAMessage } from "@whiskeysockets/baileys";
import axios from "axios";
import fs from "fs";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

import getRandomFileName from "../../functions/getRandomFileName";
import { prefix } from "../../utils/constants";

const downloadSong = async (randomFileName: string, query: string) => {
  try {
    const INFO_URL = "https://slider.kz/vk_auth.php?q=";
    // const DOWNLOAD_URL = "https://slider.kz/download/";
    let { data } = await axios.get(INFO_URL + query);

    if (data.audios[""].length <= 1) {
      console.log("==[ SONG NOT FOUND! ]==");
      return { info: "NF" };
    }

    // avoid remix,revisited,mix
    let i = 0;
    let track = data.audios[""][i];
    while (/remix|revisited|mix/i.test(track.tit_art)) {
      i += 1;
      track = data.audios[""][i];
    }
    // if reach the end then select the first song
    if (!track) {
      [track] = data.audios[""];
    }

    // let link = DOWNLOAD_URL + track.id + "/";
    // link = link + track.duration + "/";
    // link = link + track.url + "/";
    // link = link + track.tit_art + ".mp3" + "?extra=";
    // link = link + track.extra;
    let link = track.url;
    link = encodeURI(link); // to replace unescaped characters from link

    let songName = track.tit_art;
    songName = songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); // removing special characters which are not allowed in file name
    // console.log(link);
    // download(songName, link);
    const res = await axios({
      method: "GET",
      url: link,
      responseType: "stream",
    });
    data = res.data;
    const path = `./${randomFileName}`;
    const writer = fs.createWriteStream(path);
    data.pipe(writer);
    return await new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(songName));
      writer.on("error", () => reject);
    });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return { info: "ERR", err: err.stack };
    }
  }
  return null;
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, from } = msgInfoObj;

  if (args.length === 0) {
    await reply(`❌ Query is empty! \nSend ${prefix}song query`);
    return;
  }
  const randomFileName = getRandomFileName(".mp3");
  const query = args.join("%20");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await downloadSong(randomFileName, query);
  if (response && response.info === "NF") {
    await reply(
      `❌ Song not found!\nTry to put correct spelling of song along with singer name.\n[Better use ${prefix}yta command to download correct song from youtube]`
    );
    return;
  }
  if (response && response.info === "ERR") {
    await reply(response.err);
    return;
  }
  console.log(`song saved-> ./${randomFileName}`, response);

  await bot.sendMessage(
    from,
    {
      document: fs.readFileSync(`./${randomFileName}`),
      fileName: `${response}.mp3`,
      mimetype: "audio/mpeg",
    },
    { quoted: msg, mediaUploadTimeoutMs: 1000 * 60 }
  );
  fs.unlinkSync(`./${randomFileName}`);
};

const song = () => {
  const cmd = ["song"];

  return { cmd, handler };
};

export default song;
