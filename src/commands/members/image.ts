import {
  WAMessage,
  downloadContentFromMessage,
  toBuffer,
} from "@whiskeysockets/baileys";
import fs from "fs";
import { writeFile } from "fs/promises";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

import getRandomFileName from "../../functions/getRandomFileName";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, from } = msgInfoObj;

  const downloadFilePath =
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
      ?.stickerMessage;

  if (!downloadFilePath) {
    await reply("❌ Tag a sticker!");
    return;
  }

  if (downloadFilePath?.isAnimated) {
    await reply(
      "❌ There is some problem!\nTag a non-animated sticker with command to convert to Image!"
    );
    return;
  }

  const stream = await downloadContentFromMessage(downloadFilePath, "image");
  const buffer = await toBuffer(stream);

  const randomFileName = getRandomFileName(".jpeg");
  await writeFile(randomFileName, buffer);

  await bot.sendMessage(
    from,
    {
      image: fs.readFileSync(randomFileName),
    },
    {
      quoted: msg,
      mediaUploadTimeoutMs: 1000 * 60,
    }
  );

  fs.unlinkSync(randomFileName);
};

const image = () => {
  const cmd = ["image", "img", "toimg"];

  return { cmd, handler };
};

export default image;
