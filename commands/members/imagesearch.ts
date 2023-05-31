import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const gis = require("g-i-s");

export const imagesearch = () => {
  return { cmd: ["imagesearch", "is"], handler: handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply, args, from } = msgInfoObj;

  if (args.length === 0) {
    const message = `❌ Query is not given! \nSend ${prefix}is query`;
    await reply(message);
    return;
  }

  const name = args.join(" ");

  gis(name, async (error: any, results: any) => {
    if (error) {
      console.log(error);
      await reply(error);
    } else {
      try {
        if (results.length === 0) {
          await reply("❌ No result found!");
          return;
        }
        for (let i = 0; i <= 1; ++i) {
          //   console.log(JSON.stringify(results, null, "  "));
          let index = 0;
          if (results.length > 20) {
            index = Math.floor(Math.random() * 20);
          } else if (results.length > 10) {
            index = Math.floor(Math.random() * 10);
          }
          const img = results[index]["url"];
          console.log(img);

          await bot.sendMessage(
            from,
            {
              image: { url: img },
            },
            {
              quoted: msg,
              mediaUploadTimeoutMs: 1000 * 60,
            }
          );
        }
      } catch (err) {
        await reply("❌ Error in search!");
      }
    }
  });
};
