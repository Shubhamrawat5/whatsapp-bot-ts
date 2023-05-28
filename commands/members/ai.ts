import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const importDynamic = new Function("modulePath", "return import(modulePath)");
import "dotenv/config";

let api: any;
let isApiSetup = false;

export const command = () => {
  return { cmd: ["ai"], handler: handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply, args, groupName } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  if (!groupName?.toUpperCase().includes("PVX")) {
    await reply(
      `❌ COMMAND ONLY FOR PVX GROUPS!\nREASON: There is a limit with the openapi's free api`
    );
    return;
  }

  try {
    if (!isApiSetup) {
      const { ChatGPTAPI } = await importDynamic("chatgpt");
      api = new ChatGPTAPI({
        apiKey: process.env.OPENAPI,
      });
      isApiSetup = true;
    }

    if (args.length === 0) {
      await reply(`❌ Query is not given! \nSend ${prefix}ai query`);
      return;
    }

    const query = args.join(" ");
    const res = await api.sendMessage(query);

    if (res.text.length > 400) {
      res.text = res.text.slice(0, 100) + readMore + res.text.slice(100);
    }
    await reply("AI: " + res.text);
  } catch (err) {
    console.log(err);
    await reply((err as Error).toString());
  }
};
