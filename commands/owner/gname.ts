import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

const { setGroupName } = require("../../db/groupNameDB");

export const command = () => {
  let cmd = ["gname"];

  return { cmd, handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  let chats = await bot.groupFetchAllParticipating();
  let groups = Object.values(chats)
    .filter(
      (v: any) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>")
    )
    .map((v: any) => {
      return { name: v.subject, id: v.id };
    });

  // console.log(groups);
  for (let group of groups) {
    await setGroupName(group.id, group.name);
  }

  await reply(`✔ Group name data inserted!`);
};
