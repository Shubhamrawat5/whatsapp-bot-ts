import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { setBadgeText } from "../../db/badgeDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;

  if (args.length === 0) {
    await reply(`❌ Give !badgeaddtext badgeText`);
    return;
  }

  const badgeText = args.join(" ");

  const setBadgeTextRes = await setBadgeText(badgeText);
  if (setBadgeTextRes) await reply(`✔ badge text added!`);
  else await reply(`❌ There is some problem or badge is already there!`);
};

const badgeaddtext = () => {
  const cmd = ["badgeaddtext", "badgetextadd", "bat", "bta"];

  return { cmd, handler };
};

export default badgeaddtext;
