// let { igApi, getCookie } = require("insta-fetcher");
// import 'dotenv/config'
// let ig;
// let isIgSetup = false;

import { WAMessage } from "@whiskeysockets/baileys";
// import axios from "axios";
// import cheerio from "cheerio";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";

import { Bot } from "../../interfaces/Bot";
// import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  await reply("Command temperory disabled!");
};

// const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {

//   const { args, reply, from } = msgInfoObj;
//   if (args.length === 0) {
//     await reply(`❌ URL is empty! \nSend ${prefix}insta url`);
//     return;
//   }

//   let urlInsta = args[0];
//   // eslint-disable-next-line prefer-destructuring
//   if (urlInsta.includes("?")) urlInsta = urlInsta.split("/?")[0];
//   console.log(urlInsta);

//   try {
//     const form = {
//       url: urlInsta,
//       submit: "",
//     };

//     const { data } = await axios(`https://downloadgram.org/`, {
//       method: "POST",
//       data: form,
//     });
//     const $ = cheerio.load(data);

//     const directUrls: string[] = [];

//     $("#downloadhere > a").each((a, b) => {
//       const url = $(b).attr("href");
//       if (url) directUrls.push(url);
//     });

//     console.log(directUrls);

//     // async-await ERRORS are not caught inside forEach loop
//     for (let i = 0; i < directUrls.length; i++) {
//       const directUrl = directUrls[i];
//       if (directUrl.includes(".mp4")) {
//         // eslint-disable-next-line no-await-in-loop
//         await bot.sendMessage(
//           from,
//           {
//             video: { url: directUrl },
//           },
//           { quoted: msg, mediaUploadTimeoutMs: 1000 * 60 }
//         );
//       } else if (directUrl.includes(".jpg")) {
//         // eslint-disable-next-line no-await-in-loop
//         await bot.sendMessage(
//           from,
//           {
//             image: { url: directUrl },
//           },
//           { quoted: msg, mediaUploadTimeoutMs: 1000 * 60 }
//         );
//       }
//     }
//   } catch (err) {
//     if (err instanceof Error) {
//       await reply(err.toString());
//     }
//     // \n\nNote: only public insta videos can be downloaded!
//   }
// };

const insta = () => {
  const cmd = ["insta", "i", "ig"];

  return { cmd, handler };
};

export default insta;

// const handler = async (bot, msg, msgInfoObj) => {
//   let { prefix, args, reply } = msgInfoObj;
//   try {
//     if (!isIgSetup) {
//       // const username = process.env.USERNAME_IG;
//       // const password = process.env.PASSWORD_IG;
//       // const session_id = await getCookie(username, password);
//       // console.log(session_id);
//       const session_id = process.env.SESSION_ID_IG;
//       console.log(session_id);
//       ig = new igApi(session_id);
//       ig.setCookie(session_id);
//       isIgSetup = true;
//     }

//     if (args.length === 0) {
//       reply(`❌ URL is empty! \nSend ${prefix}insta url`);
//       return;
//     }

//     let urlInsta = args[0];

//     // if (
//     //   !(
//     //     urlInsta.includes("instagram.com/p/") ||
//     //     urlInsta.includes("instagram.com/reel/") ||
//     //     urlInsta.includes("instagram.com/tv/")
//     //   )
//     // ) {
//     //   reply(
//     //     `❌ Wrong URL! Only Instagram posted videos, tv and reels can be downloaded.`
//     //   );
//     //   return;
//     // }

//     if (urlInsta.includes("?")) urlInsta = urlInsta.split("/?")[0];
//     console.log(urlInsta);

//     ig.fetchPost(urlInsta)
//       .then((res) => {
//         console.log(res);
//         if (res.media_count == 1) {
//           if (res.links[0].type == "video") {
//             bot.sendMessage(
//               from,
//               {
//                 video: { url: res.links[0].url },
//               },
//               { quoted: msg }
//             );
//           } else if (res.links[0].type == "image") {
//             bot.sendMessage(
//               from,
//               {
//                 image: { url: res.links[0].url },
//               },
//               { quoted: msg }
//             );
//           }
//         } else if (res.media_count > 1) {
//           for (let i = 0; i < res.media_count; i++) {
//             if (res.links[i].type == "video") {
//               bot.sendMessage(
//                 from,
//                 {
//                   video: { url: res.links[i].url },
//                 },
//                 { quoted: msg }
//               );
//             } else if (res.links[i].type == "image") {
//               bot.sendMessage(
//                 from,
//                 {
//                   image: { url: res.links[i].url },
//                 },
//                 { quoted: msg }
//               );
//             }
//           }
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         reply(err.toString());
//       });
//   } catch (err) {
//     console.log(err);
//     reply(err.toString());
//   }
// };
