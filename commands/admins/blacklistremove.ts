import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { removeBlacklist } from "../../db/blacklistDB";

export const blacklistremove = () => {
  const cmd = ["blacklistremove", "removeblacklist", "blr"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply, args, sender } = msgInfoObj;
  let blacklistNumb = args[0];
  if (!Number(blacklistNumb)) {
    await reply(
      `❌ Give correct Indian number (without spaces) to remove from blacklist by ${prefix}blr number`
    );
    return;
  }

  if (blacklistNumb.startsWith("+")) {
    blacklistNumb = blacklistNumb.slice(1);
  }
  if (blacklistNumb.length === 10) {
    blacklistNumb = "91" + blacklistNumb;
  }

  if (blacklistNumb.length !== 12) {
    await reply(
      `❌ Give correct Indian number (without spaces) to remove from blacklist by ${prefix}blr number`
    );
    return;
  }

  const removeBlacklistRes = await removeBlacklist(blacklistNumb, sender);
  await reply(removeBlacklistRes);
};
