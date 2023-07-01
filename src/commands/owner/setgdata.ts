import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { setGroupsData } from "../../db/groupsDataDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, from, groupName } = msgInfoObj;

  const link = `https://chat.whatsapp.com/${await bot.groupInviteCode(from)}`;

  // console.log(groups);
  const setGroupsDataRes = await setGroupsData(from, groupName || "", link, []);
  if (setGroupsDataRes) {
    await reply(`✔ Group name & link data inserted!`);
  } else {
    await reply(`❌ There is some problem!`);
  }
};

const setgdata = () => {
  const cmd = ["setgdata"];

  return { cmd, handler };
};

export default setgdata;
