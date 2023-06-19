import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getMessage } from "../../functions/getMessage";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, prefix, command } = msgInfoObj;
  const chats = await bot.groupFetchAllParticipating();
  // console.log(chats);
  // !v.announce &&
  const groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us"))
    .map((v) => ({ subject: v.subject, id: v.id }));
  //  && v.subject.startsWith("<{PVX}>")
  // console.log(groups);

  const message = `Broadcast: ${await getMessage(msg, prefix, command)}\n\n`;

  console.log(message === "Broadcast:\n");
  if (message === "Broadcast:\n") {
    await reply("❌ ERROR: EMPTY MESSAGE!");
    return;
  }

  let time = 0;
  await reply("Broadcasting...");
  groups.forEach((group) => {
    setTimeout(async () => {
      await bot.sendMessage(group.id, { text: message });
    }, time);
    time += 1000 * 30; // 30 sec
  });
};

const broadcast = () => {
  const cmd = ["broadcast"];

  return { cmd, handler };
};

export default broadcast;
