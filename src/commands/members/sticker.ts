import {
  WAGenericMediaMessage,
  WAMessage,
  downloadContentFromMessage,
  toBuffer,
} from "@whiskeysockets/baileys";
import fs from "fs";
import { Sticker, StickerTypes } from "wa-sticker-formatter";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
// eslint-disable-next-line import/no-extraneous-dependencies
import ffmpeg from "fluent-ffmpeg";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import getRandomFileName from "../../functions/getRandomFileName";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const getQuality = (isCrop: boolean, args1: string, args2: string) => {
  let quality;
  if (!isCrop && args1 && !Number.isNaN(Number(args1))) {
    // 1st arg check
    quality = Number(args1);
  }
  if (isCrop && args2 && !Number.isNaN(Number(args2))) {
    // 2nd arg check
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

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, from } = msgInfoObj;
  try {
    const packName = "BOT 🤖";
    const authorName = "pvxcommunity.com";
    let quality: number;
    let downloadFilePath: WAGenericMediaMessage | null | undefined;
    let mediaType: "image" | "video";

    const args1 = args[0];
    const args2 = args[1];
    const isCrop = args1 === "c" || args1 === "crop";

    const imagePath = msg.message?.imageMessage;
    const taggedImagePath =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.imageMessage;

    const videoPath = msg.message?.videoMessage;
    const taggedVideoPath =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        ?.videoMessage;

    if (imagePath || taggedImagePath) {
      quality = 100;
      mediaType = "image";

      downloadFilePath = imagePath || taggedImagePath;
    } else if (videoPath || taggedVideoPath) {
      quality = 40;
      mediaType = "video";

      downloadFilePath = videoPath || taggedVideoPath;
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
      quality,
    });

    const stickerFileName = getRandomFileName(".webp");
    await stickerMake.toFile(stickerFileName);
    try {
      await bot.sendMessage(
        from,
        {
          sticker: fs.readFileSync(stickerFileName),
        },
        { quoted: msg, mediaUploadTimeoutMs: 1000 * 60 }
      );
      fs.unlinkSync(stickerFileName);
    } catch (error) {
      console.log("Problem with deleting media");
      // reply(error.toString());
    }
  } catch (err) {
    if (err instanceof Error) {
      await reply(err.toString());
    }
  }
};

const sticker = () => {
  const cmd = ["sticker", "s"];

  return { cmd, handler };
};

export default sticker;
