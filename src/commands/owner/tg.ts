import {
  WAMessage,
  downloadContentFromMessage,
  toBuffer,
} from "@whiskeysockets/baileys";

import { writeFile } from "fs/promises";
import AdmZip from "adm-zip";
import { Sticker, StickerTypes } from "wa-sticker-formatter";
import { Bot } from "../../interfaces/Bot";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import getRandomFileName from "../../functions/getRandomFileName";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, from } = msgInfoObj;

  const encmediatg =
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.documentMessage;

  if (!encmediatg) {
    await reply(`❌ Send zip document file!`);
    return;
  }
  // https://t.me/tgstowebpbot <- animated 128px.zip
  // https://t.me/Stickerdownloadbot <- non-animated webp.zip

  console.log("downloading...");
  const stream = await downloadContentFromMessage(encmediatg, "document");
  const buffer = await toBuffer(stream);

  // let buffer = await downloadContentFromMessage(encmediatg, "document");
  const media = getRandomFileName(".zip");
  await writeFile(media, buffer);
  console.log("downloaded");
  // return;

  // reading zip
  const zip = new AdmZip(`./${media}`);
  // extracts everything
  zip.extractAllTo(`./`, true);
  const zipEntries = zip.getEntries(); // an array of ZipEntry records

  // let filestg = fs.readdirSync(dirNametg);
  const stickerCounttg = zipEntries.length;
  console.log(`extracted: files ${stickerCounttg}`);

  await reply(`✔ Sending all ${stickerCounttg} stickers`);
  let itg = -1;
  const setIntervaltg = setInterval(async () => {
    itg += 1;

    // last file
    if (itg >= stickerCounttg - 1) {
      // stickertg = false;
      clearInterval(setIntervaltg);
      await reply(`✔ Finished!`);
    }
    console.log("Sending sticker ", itg);
    if (zipEntries[itg].entryName.endsWith(".webp")) {
      let filepath = `./`;
      // add slash of not present
      filepath += zipEntries[itg].entryName.startsWith("/") ? "" : "/";
      filepath += `${zipEntries[itg].entryName}`;

      const sticker = new Sticker(filepath, {
        pack: "BOT 🤖",
        author: "pvxcommunity.com",
        type: StickerTypes.DEFAULT,
        quality: 75,
      });
      await bot.sendMessage(from, await sticker.toMessage());
    }
  }, 0);
};

const tg = () => {
  const cmd = ["tg"];

  return { cmd, handler };
};

export default tg;
