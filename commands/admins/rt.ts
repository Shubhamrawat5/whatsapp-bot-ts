import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

export const command = () => {
  let cmd = ["rt", "randomtag"];

  return { cmd, handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { groupMembers, args, from } = msgInfoObj;
  if (!groupMembers) return;

  let jids = [];
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

  let member = groupMembers[Math.floor(Math.random() * groupMembers.length)];
  message += "@" + member.id.split("@")[0] + " ";
  jids.push(member.id.replace("c.us", "s.whatsapp.net"));

  await bot.sendMessage(
    from,
    { text: message, mentions: jids },
    { quoted: msg }
  );
};
