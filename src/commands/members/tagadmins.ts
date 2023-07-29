import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import getMessage from "../../functions/getMessage";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupAdmins, command, from } = msgInfoObj;
  const jids: string[] = [];
  let message = `ADMINS: ${await getMessage(msg, command)}\n\n`;

  groupAdmins.forEach((admin) => {
    message += `@${admin.split("@")[0]} `;
    jids.push(admin.replace("c.us", "s.whatsapp.net"));
  });

  await bot.sendMessage(
    from,
    { text: message, mentions: jids },
    { quoted: msg }
  );
};

const tagadmins = () => {
  const cmd = ["tagadmin", "tagadmins", "ta"];

  return { cmd, handler };
};

export default tagadmins;
