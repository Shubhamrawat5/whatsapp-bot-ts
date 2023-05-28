import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

export const command = () => {
  const cmd = ["rt", "randomtag"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupMembers, args, from } = msgInfoObj;
  if (!groupMembers) return;

  const jids = [];
  let message = "Hey ";
  if (
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation
  ) {
    message +=
      msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation +
      "\n\n";
  } else {
    message += args.length ? args.join(" ") + "\n\n" : "";
  }

  const member = groupMembers[Math.floor(Math.random() * groupMembers.length)];
  message += "@" + member.id.split("@")[0] + " ";
  jids.push(member.id.replace("c.us", "s.whatsapp.net"));

  await bot.sendMessage(
    from,
    { text: message, mentions: jids },
    { quoted: msg }
  );
};
