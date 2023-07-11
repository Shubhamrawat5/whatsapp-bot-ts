import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { setGroupLinksEnabled } from "../../db/groupLinksEnabled";
import { prefix } from "../../constants/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;

  const errorMessage = `❌ There is some problem!\nGive only integer value with ${prefix}websitelink 0 or 1`;

  if (args.length === 0) {
    await reply(errorMessage);
    return;
  }

  const enabled = Number(args[0]);
  if (enabled === 0 || enabled === 1) {
    const setGroupLinkEnabledRes = await setGroupLinksEnabled(enabled === 1);

    if (setGroupLinkEnabledRes) {
      await reply(`✔ Group link enabled updated with value: ${enabled === 1}`);
    } else {
      await reply(errorMessage);
    }
  } else {
    await reply(errorMessage);
  }
};

const websitelink = () => {
  const cmd = ["websitelink", "websitelinks"];

  return { cmd, handler };
};

export default websitelink;
