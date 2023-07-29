import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

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
  let temppvxList: { subject: string; count: number }[] = [];
  groups.forEach((group) => {
    totalMem += group.participants.length;
    temppvxList.push({
      subject: group.subject,
      count: group.participants.length,
    });

    group.participants.forEach((participant) => {
      uniqueMem.add(participant.id);
    });
  });

  temppvxList = temppvxList.sort((x, y) => y.count - x.count); // sort

  temppvxList.forEach((grp) => {
    temppvxMsg += `\n\n*${grp.subject}*\nMembers: ${grp.count}`;
  });

  pvxMsg += `\nTotal Groups: ${groups.length}\nTotal Members: ${totalMem}\nUnique Members: ${uniqueMem.size}`;
  pvxMsg += temppvxMsg;

  await reply(pvxMsg);
};

const pvxstats = () => {
  const cmd = ["pvxstats"];

  return { cmd, handler };
};

export default pvxstats;
