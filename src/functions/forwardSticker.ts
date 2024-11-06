import {
  downloadContentFromMessage,
  proto,
  toBuffer,
} from "@whiskeysockets/baileys";
import { Exif } from "wa-sticker-formatter";
import { Bot } from "../interfaces/Bot";
import { pvxgroups } from "../utils/constants";

// TODO: GLOBAL VARIALBES
let countSent = 0;
let countIn = 0;
let countErr = 0;
let sameSticker = 0;
// it will be better to store this record in db or file
const last20SentStickersSum = new Array<string>(50).fill("");

const forwardSticker = async (
  bot: Bot,
  downloadFilePath: proto.Message.IStickerMessage
): Promise<boolean> => {
  const randomBoolean = Math.random() < 0.5;
  if (!randomBoolean) {
    console.log("RandomBoolean", randomBoolean);
    return false;
  }

  try {
    const stickerChecksum = downloadFilePath.fileSha256
      ? Buffer.from(downloadFilePath.fileSha256).toString("hex")
      : "";

    if (last20SentStickersSum.includes(stickerChecksum)) {
      console.log("same sticker again.");
      sameSticker += 1;
      return false;
    }

    last20SentStickersSum.shift();
    last20SentStickersSum.push(stickerChecksum);
    countIn += 1;
    const stream = await downloadContentFromMessage(
      downloadFilePath,
      "sticker"
    );

    const buffer = await toBuffer(stream);

    const webpWithExif = await new Exif({
      pack: "BOT 🤖",
      author: "pvxcommunity.com",
    }).add(buffer);

    // 1000*60*60*24 = 86400ms = 1 day
    await bot.sendMessage(
      pvxgroups.pvxstickeronly1,
      { sticker: webpWithExif },
      {
        ephemeralExpiration: 86400,
        mediaUploadTimeoutMs: 1000 * 60,
      }
    );

    await bot.sendMessage(
      pvxgroups.pvxstickeronly2,
      { sticker: webpWithExif },
      {
        ephemeralExpiration: 86400,
        mediaUploadTimeoutMs: 1000 * 60,
      }
    );

    countSent += 1;
    console.log(
      `${countSent} sticker sent! In:${countIn}, Err:${countErr}, Same: ${sameSticker}`
    );
    return true;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.toString());
      // await loggerTg(`ERROR: [FORWARD-STICKER]\n${err.toString()}`);
    }
    countErr += 1;
    return false;
  }
};

export default forwardSticker;
