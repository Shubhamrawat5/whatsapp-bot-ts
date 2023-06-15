import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import { getBlacklist } from "../../db/blacklistDB";

export const blacklist = () => {
  const cmd = ["blacklist"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const getBlacklistRes = await getBlacklist();
  let blacklistMsg = "Blacklisted Numbers\n";
  getBlacklistRes.forEach((num, index) => {
    const numSplit = num.admin
      ? `${num.admin.split("@s.whatsapp.net")[0]}`
      : "-";
    blacklistMsg += `\n${index + 1}) ${num.number} : ${
      num.reason
    } (given by ${numSplit})`;
  });

  await reply(blacklistMsg);
};
