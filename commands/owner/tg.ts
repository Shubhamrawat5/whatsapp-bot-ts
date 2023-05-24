import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import { downloadContentFromMessage, toBuffer } from "@adiwajshing/baileys";
import { writeFile } from "fs/promises";
const AdmZip = require("adm-zip");
import { Sticker, StickerTypes } from "wa-sticker-formatter";

export const command = () => {
  let cmd = ["tg"];

  return { cmd, handler };
};

const getRandom = (ext: string) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { reply, isTaggedDocument, from } = msgInfoObj;

  if (!isTaggedDocument) {
    await reply(`❌ Send zip document file!`);
    return;
  }
  // https://t.me/tgstowebpbot <- animated 128px.zip
  // https://t.me/Stickerdownloadbot <- non-animated webp.zip
  const encmediatg =
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.documentMessage;

  if (!encmediatg) {
    await reply(`❌ There is some problem with downloading media!`);
    return;
  }

  console.log("downloading...");
  const stream = await downloadContentFromMessage(encmediatg, "document");
  const buffer = await toBuffer(stream);

  // let buffer = await downloadContentFromMessage(encmediatg, "document");
  const media = getRandom(".zip");
  await writeFile(media, buffer);
  console.log("downloaded");
  // return;

  // reading zip
  let zip = new AdmZip(`./${media}`);
  // extracts everything
  zip.extractAllTo(`./`, true);
  let zipEntries = zip.getEntries(); // an array of ZipEntry records

  // let filestg = fs.readdirSync(dirNametg);
  let stickerCounttg = zipEntries.length;
  console.log("extracted: files " + stickerCounttg);

  await reply(`✔ Sending all ${stickerCounttg} stickers`);
  let itg = -1;
  const setIntervaltg = setInterval(async () => {
    itg += 1;

    //last file
    if (itg >= stickerCounttg - 1) {
      // stickertg = false;
      clearInterval(setIntervaltg);
      await reply(`✔ Finished!`);
    }
    console.log("Sending sticker ", itg);
    if (zipEntries[itg].entryName.endsWith(".webp")) {
      let filepath = `./`;
      //add slash of not present
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
