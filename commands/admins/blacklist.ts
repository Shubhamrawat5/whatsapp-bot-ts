import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const { getBlacklist } = require("../../db/blacklistDB");

export const command = () => {
  let cmd = ["blacklist"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { reply } = msgInfoObj;

  interface BlacklistRes {
    number: string;
    reason: string;
  }

  let blacklistRes: BlacklistRes[] = await getBlacklist();
  let blacklistMsg = "Blacklisted Numbers\n";
  blacklistRes.forEach((num) => {
    blacklistMsg += `\n${num.number}: ${num.reason}`;
  });

  await reply(blacklistMsg);
};
