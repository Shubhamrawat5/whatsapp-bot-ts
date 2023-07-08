import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import { getBlacklist } from "../../db/blacklistDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const getBlacklistRes = await getBlacklist();
  let blacklistMsg = "Blacklisted Numbers\n";
  getBlacklistRes.forEach((blacklist, index) => {
    blacklistMsg += `\n${index + 1}) ${blacklist.number}`;
    if (blacklist.reason) {
      blacklistMsg += ` : ${blacklist.reason}`;
    }
    if (blacklist.adminname) {
      blacklistMsg += ` (given by ${blacklist.adminname})`;
    }
  });

  await reply(blacklistMsg);
};

const blacklist = () => {
  const cmd = ["blacklist"];

  return { cmd, handler };
};

export default blacklist;
