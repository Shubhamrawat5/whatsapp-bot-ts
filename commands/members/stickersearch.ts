import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const gis = require("g-i-s");
import fs from "fs";
import { Sticker, StickerTypes } from "wa-sticker-formatter";
import { getRandomFileName } from "../../functions/getRandomFileName";

export const command = () => {
  return { cmd: ["stickersearch", "ss"], handler: handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply, args, from } = msgInfoObj;

  if (args.length === 0) {
    const message = `❌ Query is not given! \nSend ${prefix}ss query`;
    await reply(message);
    return;
  }

  const name = args.join(" ");

  gis(name, async (error: any, results: any) => {
    if (error) {
      console.log(error);
      await reply(error);
    } else {
      if (results.length === 0) {
        await reply("❌ No result found!");
        return;
      }
      for (let i = 0; i <= 1; ++i) {
        let index = 0;
        if (results.length > 20) {
          index = Math.floor(Math.random() * 20);
        } else if (results.length > 10) {
          index = Math.floor(Math.random() * 10);
        }
        const img = results[index]["url"];
        console.log(img);

        const packName = "BOT 🤖";
        const authorName = "pvxcommunity.com";
        const stickerMake = new Sticker(img, {
          pack: packName,
          author: authorName,
          type: StickerTypes.FULL,
          quality: 100,
        });

        const stickerFileName = getRandomFileName(".webp");

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
      }
    }
  });
};
