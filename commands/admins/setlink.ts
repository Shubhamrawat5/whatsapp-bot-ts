import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { setGroupLink, setGroupLinkEnabled } from "../../db/grouplinksDB";

export const setlink = () => {
  const cmd = ["setlink", "sl"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply, args, from } = msgInfoObj;

  if (args[0]) {
    const enabled = Number(args[0]);

    const setGroupLinkEnabledRes = await setGroupLinkEnabled(enabled);

    if (setGroupLinkEnabledRes)
      await reply(`✔ Group link enabled updated with value: ${enabled}`);
    else
      await reply(
        `❌ There is some problem!\nGive only integer value with ${prefix}setlink #0`
      );
    return;
  }

  const link = "https://chat.whatsapp.com/" + (await bot.groupInviteCode(from));
  console.log(from, link);

  if (!from.endsWith("@g.us")) {
    await reply(`❌ Wrong groupjid!`);
    return;
  }

  if (!link.startsWith("https://chat.whatsapp.com/")) {
    await reply(`❌ Wrong grouplink!`);
    return;
  }

  const setGroupLinkRes = await setGroupLink(from, link);
  if (setGroupLinkRes) await reply(`✔ Group link updated in DB!`);
  else await reply(`❌ There is some problem!`);
};
