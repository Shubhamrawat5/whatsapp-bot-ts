import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { setMetaValues } from "../../db/metaDB";
import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;

  const errorMessage = `❌ There is some problem!\nGive only integer value with ${prefix}websitelink 0 or 1`;

  if (args.length === 0) {
    await reply(errorMessage);
    return;
  }

  const isEnabled = Number(args[0]);
  if (isEnabled === 0 || isEnabled === 1) {
    const setGroupLinkEnabledRes = await setMetaValues(
      "groups_link_enabled",
      isEnabled === 1
    );

    if (setGroupLinkEnabledRes) {
      await reply(
        `✔ Groups Link Enabled updated with value: ${isEnabled === 1}`
      );
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
