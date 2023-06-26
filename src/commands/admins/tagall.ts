import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import getMessage from "../../functions/getMessage";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupMembers, command, from } = msgInfoObj;
  if (!groupMembers) return;
  // if (
  //  groupName.toUpperCase().includes("PVX") &&
  //  ![myNumber + "@s.whatsapp.net", botNumberJid].includes(sender)
  // ) {
  //  await reply(`❌ Owner only command for avoiding spam in PVX Groups!`);
  //  return;
  // }

  const jids: string[] = [];
  let message = `ALL: ${await getMessage(msg, command)}\n\n`;

  groupMembers.forEach((member) => {
    if (command === "tagall") message += `@${member.id.split("@")[0]} `;
    jids.push(member.id);
  });

  await bot.sendMessage(
    from,
    { text: message, mentions: jids },
    { quoted: msg }
  );
};

const tagall = () => {
  const cmd = ["tagall", "hiddentagall", "tagallhidden"];

  return { cmd, handler };
};

export default tagall;
