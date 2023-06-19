import {
  WAMessage,
  downloadContentFromMessage,
  toBuffer,
} from "@adiwajshing/baileys";
import fs from "fs";
import { writeFile } from "fs/promises";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import { getRandomFileName } from "../../functions/getRandomFileName";

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

  const media = getRandomFileName(".jpeg");
  await writeFile(media, buffer);

  await bot.sendMessage(
    from,
    {
      image: fs.readFileSync(media),
    },
    {
      quoted: msg,
      mediaUploadTimeoutMs: 1000 * 60,
    }
  );
  try {
    fs.unlinkSync(media);
  } catch (error) {
    console.log("Problem with deleting media");
    // reply(error.toString());
  }
};

const image = () => {
  const cmd = ["image", "img", "toimg"];

  return { cmd, handler };
};

export default image;
