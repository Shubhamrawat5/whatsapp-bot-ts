import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { setGroupData } from "../../db/pvxGroupDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, from, groupName } = msgInfoObj;

  const link = `https://chat.whatsapp.com/${await bot.groupInviteCode(from)}`;

  // console.log(groups);
  const setGroupsDataRes = await setGroupData(
    from,
    groupName ?? "Not Found",
    link
  );
  if (setGroupsDataRes) {
    await reply(`✔ Group name & link data updated!`);
  } else {
    await reply(`❌ There is some problem!`);
  }
};

const setlink = () => {
  const cmd = ["setlink", "updatelink"];

  return { cmd, handler };
};

export default setlink;
