import { ChatGPTAPI as ChatGptApiInterface } from "chatgpt";
import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";
import { openAiKey } from "../../utils/config";

// CHECK GLOBAL VARIABLE
let chatgpt: ChatGptApiInterface;
let isApiSetup = false;

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  // if (!groupName?.toUpperCase().includes("PVX")) {
  //   await reply(
  //     `❌ COMMAND ONLY FOR PVX GROUPS!\nREASON: There is a limit with the openapi's free api`
  //   );
  //   return;
  // }

  if (!openAiKey) {
    await reply(`❌ openapi key is not set!`);
    return;
  }

  try {
    if (!isApiSetup) {
      const { ChatGPTAPI } = await import("chatgpt");

      chatgpt = new ChatGPTAPI({
        apiKey: openAiKey,
      });
      isApiSetup = true;
    }

    if (args.length === 0) {
      await reply(`❌ Query is not given! \nSend ${prefix}ai query`);
      return;
    }

    const query = args.join(" ");
    const res = await chatgpt.sendMessage(query);

    if (res.text.length > 400) {
      res.text = res.text.slice(0, 100) + readMore + res.text.slice(100);
    }
    await reply(`AI: ${res.text}`);
  } catch (err) {
    console.log(err);
    await reply((err as Error).toString());
  }
};

const ai = () => {
  const cmd = ["ai"];

  return { cmd, handler };
};

export default ai;
