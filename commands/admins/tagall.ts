import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getMessage } from "../../functions/getMessage";

export const tagall = () => {
  const cmd = ["tagall", "hiddentagall", "tagallhidden"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupMembers, prefix, command, from } = msgInfoObj;
  if (!groupMembers) return;
  //if (
  //  groupName.toUpperCase().includes("PVX") &&
  //  ![myNumber + "@s.whatsapp.net", botNumberJid].includes(sender)
  //) {
  //  await reply(`❌ Owner only command for avoiding spam in PVX Groups!`);
  //  return;
  //}

  const jids = [];
  let message = "ALL: " + (await getMessage(msg, prefix, command)) + "\n\n";

  for (const member of groupMembers) {
    if (command === "tagall") message += "@" + member.id.split("@")[0] + " ";
    jids.push(member.id);
  }

  await bot.sendMessage(
    from,
    { text: message, mentions: jids },
    { quoted: msg }
  );
};
