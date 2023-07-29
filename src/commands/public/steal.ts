import {
  WAMessage,
  downloadContentFromMessage,
  toBuffer,
} from "@whiskeysockets/baileys";
import { Exif } from "wa-sticker-formatter";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, from } = msgInfoObj;

  let packName = "BOT 🤖";
  const authorName = "pvxcommunity.com";

  const downloadFilePath =
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.stickerMessage;

  if (!downloadFilePath) {
    await reply("❌ Tag a sticker!");
    return;
  }

  if (args.length) {
    packName = args.join(" ");
  }

  if (!downloadFilePath) {
    await reply(`❌ There is some problem with downloading media!`);
    return;
  }

  const stream = await downloadContentFromMessage(downloadFilePath, "sticker");
  const buffer = await toBuffer(stream);

  const webpWithExif = await new Exif({
    pack: packName,
    author: authorName,
  }).add(buffer);

  await bot.sendMessage(
    from,
    { sticker: webpWithExif },
    {
      mediaUploadTimeoutMs: 1000 * 60,
    }
  );
};

const steal = () => {
  const cmd = ["steal"];

  return { cmd, handler };
};

export default steal;
