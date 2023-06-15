import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

export const pvxstats = () => {
  const cmd = ["pvxstats"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  const chats = await bot.groupFetchAllParticipating();
  // console.log(chats);
  // !v.announce &&
  const groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>"))
    .map((v) => ({
      subject: v.subject,
      id: v.id,
      participants: v.participants,
    }));
  // console.log(groups);

  let pvxMsg = `*📛 PVX STATS 📛*${readMore}`;
  let totalMem = 0;
  const uniqueMem = new Set();
  let temppvxMsg = "";
  let temppvxList = [];
  for (const group of groups) {
    totalMem += group.participants.length;
    temppvxList.push({
      subject: group.subject,
      count: group.participants.length,
    });

    for (const participant of group.participants) {
      uniqueMem.add(participant.id);
    }
  }
  temppvxList = temppvxList.sort((x, y) => y.count - x.count); // sort

  temppvxList.forEach((grp) => {
    temppvxMsg += `\n\n*${grp.subject}*\nMembers: ${grp.count}`;
  });

  pvxMsg += `\nTotal Groups: ${groups.length}\nTotal Members: ${totalMem}\nUnique Members: ${uniqueMem.size}`;
  pvxMsg += temppvxMsg;

  await reply(pvxMsg);
};
