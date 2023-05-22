import {
  WAGenericMediaMessage,
  WAMessage,
  downloadContentFromMessage,
  toBuffer,
} from "@adiwajshing/baileys";
import fs from "fs";
import { Sticker, StickerTypes } from "wa-sticker-formatter";
import { MsgInfoObj } from "../../interface/msgInfoObj";
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

export const command = () => {
  let cmd = ["sticker", "s"];

  return { cmd, handler };
};

const getRandom = (ext: string) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

const getQuality = (isCrop: boolean, args1: string, args2: string) => {
  let quality;
  if (!isCrop && args1 && !isNaN(Number(args1))) {
    //1st arg check
    quality = Number(args1);
  }
  if (isCrop && args2 && !isNaN(Number(args2))) {
    //2nd arg check
    quality = Number(args2);
  }

  return quality;
};

const downloadMedia = async (
  mediaType: "image" | "video",
  downloadFilePath: WAGenericMediaMessage
) => {
  const stream = await downloadContentFromMessage(downloadFilePath, mediaType);
  const buffer = await toBuffer(stream);

  return buffer;
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { type, reply, args, from } = msgInfoObj;
  let packName = "BOT 🤖";
  let authorName = "pvxcommunity.com";
  let quality: number;
  let downloadFilePath: WAGenericMediaMessage | null | undefined;
  let mediaType: "image" | "video";

  const args1 = args[0];
  const args2 = args[1];
  const isCrop = args1 === "c" || args1 === "crop";

  const taggedImagePath =
    msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
  const taggedVideoPath =
    msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;

  if (type === "imageMessage" || taggedImagePath) {
    quality = 100;
    mediaType = "image";

    if (msg?.message?.imageMessage) {
      downloadFilePath = msg.message.imageMessage;
    } else {
      downloadFilePath = taggedImagePath;
    }
  } else if (type === "videoMessage" || taggedVideoPath) {
    quality = 40;
    mediaType = "image";

    if (msg?.message?.videoMessage) {
      downloadFilePath = msg.message.videoMessage;
    } else {
      downloadFilePath = taggedVideoPath;
    }
  } else {
    await reply("❌ Give a media (image/video) to convert into sticker!");
    return;
  }

  if (!downloadFilePath) return;

  const limit = 2;
  if (
    downloadFilePath.fileLength &&
    Number(downloadFilePath.fileLength) > limit * 1000 * 1000
  ) {
    await reply(`❌ File size is too large!\nVideo limit: ${limit}mb`);
    return;
  }

  const buffer = await downloadMedia(mediaType, downloadFilePath);
  const resQuality = getQuality(isCrop, args1, args2);

  if (resQuality) quality = resQuality;
  console.log("Sticker Quality: ", quality);

  const stickerMake = new Sticker(buffer, {
    pack: packName, // The pack name
    author: authorName, // The author name
    type: isCrop ? StickerTypes.CROPPED : StickerTypes.FULL,
    quality: quality,
  });

  const stickerFileName = getRandom(".webp");
  await stickerMake.toFile(stickerFileName);
  await bot.sendMessage(
    from,
    {
      sticker: fs.readFileSync(stickerFileName),
    },
    { quoted: msg, mediaUploadTimeoutMs: 1000 * 30 }
  );
  try {
    fs.unlinkSync(stickerFileName);
  } catch (error) {
    console.log("Problem with deleting media");
    // reply(error.toString());
  }
};
