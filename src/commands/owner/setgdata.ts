import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { setGroupNameLink } from "../../db/groupDataDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const chats = await bot.groupFetchAllParticipating();
  const groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>"))
    .map((v) => ({ name: v.subject, id: v.id, link: v.inviteCode }));

  let countSuccess = 0;
  let countFail = 0;

  // console.log(groups);
  groups.forEach(async (group) => {
    const setGroupNameRes = await setGroupNameLink(
      group.id,
      group.name,
      group.link
    );
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

const setgdata = () => {
  const cmd = ["setgdata"];

  return { cmd, handler };
};

export default setgdata;
