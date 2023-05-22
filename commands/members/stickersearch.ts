import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

const gis = require("g-i-s");
const fs = require("fs");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const getRandom = (ext: string) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

export const command = () => {
  return { cmd: ["stickersearch", "ss"], handler: handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { prefix, reply, args, from } = msgInfoObj;

  if (args.length === 0) {
    let message = `❌ Query is not given! \nSend ${prefix}ss query`;
    await reply(message);
    return;
  }

  let name = args.join(" ");

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
        let img = results[index]["url"];
        console.log(img);

        let packName = "BOT 🤖";
        let authorName = "pvxcommunity.com";
        const stickerMake = new Sticker(img, {
          pack: packName,
          author: authorName,
          type: StickerTypes.FULL,
          quality: 100,
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
      }
    }
  });
};
