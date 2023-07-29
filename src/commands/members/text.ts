// const { UltimateTextToImage } = require("ultimate-text-to-image");
// import { Sticker } from "wa-sticker-formatter";
// import fs from "fs";

import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
// import  getMessage  from "../../functions/getMessage";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  await reply("Command temperory disabled!");
};

// const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
//   let { reply, command, from } = msgInfoObj;

//   const message = await getMessage(msg, command);

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

const text = () => {
  const cmd = ["text", "tts"];

  return { cmd, handler };
};

export default text;
