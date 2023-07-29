import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import getMessage from "../../functions/getMessage";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupMembers, command, from } = msgInfoObj;
  if (!groupMembers) return;

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
