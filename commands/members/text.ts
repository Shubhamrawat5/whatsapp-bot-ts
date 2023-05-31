// const { UltimateTextToImage } = require("ultimate-text-to-image");
// import { Sticker } from "wa-sticker-formatter";
// import fs from "fs";

import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
// import { getMessage } from "../../functions/getMessage";

export const text = () => {
  return { cmd: ["text", "tts"], handler: handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  await reply("Command temperory disabled!");
};

// const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
//   let { reply, prefix, command, from } = msgInfoObj;

//   const message = await getMessage(msg, prefix, command);

//   if (!message) {
//     reply("❌ Empty message!");
//     return;
//   }

//   // #00FF00 - green
//   // #ff0000 - red
//   const textToImage = new UltimateTextToImage(message, {
//     width: 500,
//     height: 500,
//     fontFamily: "Arial",
//     fontColor: "#00FF00",
//     fontSize: 56,
//     minFontSize: 10,
//     lineHeight: 40,
//     autoWrapLineHeightMultiplier: 1.2,
//     margin: 20,
//     marginBottom: 40,
//     align: "center",
//     valign: "middle",
//   }).render();

//   const buffer = textToImage.toBuffer(); // png by default

//   let packName = "BOT 🤖";
//   let authorName = "pvxcommunity.com";
//   const stickerMake = new Sticker(buffer, {
//     pack: packName,
//     author: authorName,
//   });

//   const stickerFileName = getRandom(".webp");
//   await stickerMake.toFile(stickerFileName);
//   await bot.sendMessage(
//     from,
//     {
//       sticker: fs.readFileSync(stickerFileName),
//     },
//     {
//       quoted: msg,
//       mediaUploadTimeoutMs: 1000 * 60,
//     }
//   );
//   try {
//     fs.unlinkSync(stickerFileName);
//   } catch {
//     console.log("error in deleting file.");
//   }
// };
