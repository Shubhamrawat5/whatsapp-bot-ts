import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { setGroupName } from "../../db/groupNameDB";

export const gname = () => {
  const cmd = ["gname"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const chats = await bot.groupFetchAllParticipating();
  const groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>"))
    .map((v) => ({ name: v.subject, id: v.id }));

  let countSuccess = 0;
  let countFail = 0;

  // console.log(groups);
  groups.forEach(async (group) => {
    const setGroupNameRes = await setGroupName(group.id, group.name);
    if (setGroupNameRes) {
      countSuccess += 1;
    } else {
      countFail += 1;
    }
  });

  await reply(
    `✔ Group name data inserted!\nSuccess: ${countSuccess}\nFail: ${countFail}`
  );
};
