import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { setGroupLinksEnabled } from "../../db/groupLinksEnabled";
import { prefix } from "../../constants/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;

  if (args.length === 0) {
    await reply(
      `❌ There is some problem!\nGive only integer value with ${prefix}websitelink #0`
    );
    return;
  }

  const enabled = Number(args[0]);

  const setGroupLinkEnabledRes = await setGroupLinksEnabled(enabled);

  if (setGroupLinkEnabledRes) {
    await reply(`✔ Group link enabled updated with value: ${enabled}`);
  } else {
    await reply(
      `❌ There is some problem!\nGive only integer value with ${prefix}websitelink #0`
    );
  }
};

const websitelink = () => {
  const cmd = ["websitelink", "websitelinks"];

  return { cmd, handler };
};

export default websitelink;
