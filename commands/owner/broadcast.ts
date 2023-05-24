import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

export const command = () => {
  let cmd = ["broadcast", "bc"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { reply, args } = msgInfoObj;
  let chats = await bot.groupFetchAllParticipating();
  // console.log(chats);
  // !v.announce &&
  let groups = Object.values(chats)
    .filter((v: any) => v.id.endsWith("g.us"))
    .map((v: any) => {
      return { subject: v.subject, id: v.id };
    });
  //  && v.subject.startsWith("<{PVX}>")
  // console.log(groups);

  let message = "Broadcast:\n";
  if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
    if (msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation)
      message +=
        msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation;
    else
      message +=
        msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
          .extendedTextMessage?.text;
  } else {
    message += args.length ? args.join(" ") : "";
  }

  console.log(message == "Broadcast:\n");
  if (message == "Broadcast:\n") {
    await reply("❌ ERROR: EMPTY MESSAGE!");
    return;
  }

  let time = 0;
  await reply("Broadcasting...");
  groups.forEach((group) => {
    setTimeout(async () => {
      await bot.sendMessage(group.id, { text: message });
    }, time);
    time += 1000 * 30; //30 sec
  });
};
