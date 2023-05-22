import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

const { getMessage } = require("../../functions/getMessage");

export const command = () => {
  let cmd = ["tagall", "hiddentagall", "tagallhidden"];

  return { cmd, handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { groupMembers, prefix, command, from } = msgInfoObj;
  if (!groupMembers) return;
  //if (
  //  groupName.toUpperCase().includes("PVX") &&
  //  ![myNumber + "@s.whatsapp.net", botNumberJid].includes(sender)
  //) {
  //  await reply(`❌ Owner only command for avoiding spam in PVX Groups!`);
  //  return;
  //}

  let jids = [];
  let message = "ALL: " + (await getMessage(msg, prefix, command)) + "\n\n";

  for (let member of groupMembers) {
    if (command === "tagall") message += "@" + member.id.split("@")[0] + " ";
    jids.push(member.id);
  }

  await bot.sendMessage(
    from,
    { text: message, mentions: jids },
    { quoted: msg }
  );
};
