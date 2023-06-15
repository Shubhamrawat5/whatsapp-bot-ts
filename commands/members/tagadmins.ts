import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getMessage } from "../../functions/getMessage";

export const tagadmins = () => {
  const cmd = ["tagadmin", "tagadmins", "ta"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupAdmins, prefix, command, from } = msgInfoObj;
  const jids = [];
  let message = `ADMINS: ${await getMessage(msg, prefix, command)}\n\n`;

  for (const admin of groupAdmins) {
    message += `@${admin.split("@")[0]} `;
    jids.push(admin.replace("c.us", "s.whatsapp.net"));
  }

  await bot.sendMessage(
    from,
    { text: message, mentions: jids },
    { quoted: msg }
  );
};
