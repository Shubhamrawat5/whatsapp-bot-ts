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
const last20SentStickersSize = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

const forwardSticker = async (
  bot: Bot,
  downloadFilePath: proto.Message.IStickerMessage
) => {
  try {
    const stickerSize = Number(downloadFilePath.fileLength);
    if (!stickerSize) {
      return false;
    }

    if (last20SentStickersSize.includes(stickerSize)) {
      console.log("same sticker again.");
      sameSticker += 1;
      return false;
    }

    last20SentStickersSize.shift();
    last20SentStickersSize.push(stickerSize);
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
    // await bot.sendMessage(
    //   pvxgroups.pvxstickeronly3,
    //   { sticker: webpWithExif },
    //   {
    //     ephemeralExpiration: 86400,
    //     mediaUploadTimeoutMs: 1000 * 60,
    //   }
    // );

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
