import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import getMessage from "../../functions/getMessage";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupMembers, command, from } = msgInfoObj;
  if (!groupMembers) return;

  const jids = [];
  let message = `Hey ${await getMessage(msg, command)}`;

  const member = groupMembers[Math.floor(Math.random() * groupMembers.length)];
  message += ` @${member.id.split("@")[0]} `;
  jids.push(member.id.replace("c.us", "s.whatsapp.net"));

  await bot.sendMessage(
    from,
    { text: message, mentions: jids },
    { quoted: msg }
  );
};

const rt = () => {
  const cmd = ["rt", "randomtag"];

  return { cmd, handler };
};

export default rt;
