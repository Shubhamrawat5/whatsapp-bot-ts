import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountIndividual, getRankInAllGroups } from "../../db/countMemberDB";
import { getMilestone } from "../../db/milestoneDB";

export const command = () => {
  const cmd = ["rank"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { sender, reply, args, milestones, from } = msgInfoObj;
  if (args.length) {
    sender = args.join("") + "@s.whatsapp.net";
  }
  if (msg.message?.extendedTextMessage?.contextInfo) {
    if (msg.message.extendedTextMessage.contextInfo.participant)
      sender = msg.message.extendedTextMessage.contextInfo.participant;
    else if (msg.message.extendedTextMessage.contextInfo.mentionedJid)
      sender = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
  }

  if (sender.startsWith("+")) {
    sender = sender.slice(1);
  }
  if (sender.length === 10 + 15) {
    sender = "91" + sender;
  }

  const res = await getRankInAllGroups(sender);
  const { name, ranks, count, totalUsers } = res[0];
  if (!name) {
    await reply(`❌ ERROR: ${sender.split("@")[0]} NOT FOUND in Database!`);
    return;
  }

  const res2 = await getCountIndividual(sender, from);
  const countCurGroup = res2[0].count;

  //find rank
  let rankName;
  if (ranks <= 10) {
    rankName = "Prime 🔮";
  } else if (ranks <= 50) {
    rankName = "Diamond 💎";
  } else if (ranks <= 100) {
    rankName = "Platinum 🛡";
  } else if (ranks <= 500) {
    rankName = "Elite 🔰";
  } else if (ranks <= 1000) {
    rankName = "Gold ⭐️ ";
  } else if (ranks <= 1500) {
    rankName = "Silver ⚔️";
  } else {
    rankName = "Bronze ⚱️";
  }

  let message = `${name} (#${ranks}/${totalUsers})\nRank: ${rankName}\n\n*💬 message count*\nAll PVX groups: ${count}\nCurrent group  : ${countCurGroup}`;

  const milestoneRes = await getMilestone(sender);

  let flag = false;
  if (milestoneRes.length) {
    flag = true;
    message += `\n`;
    milestoneRes[0].achieved.forEach((achieve: string) => {
      message += `\n⭐ ${achieve}`;
    });
  }

  if (milestones[sender]) {
    if (!flag) message += `\n`;
    milestones[sender].forEach((achieve) => {
      message += `\n⭐ ${achieve}`;
    });
  }

  await bot.sendMessage(
    from,
    {
      text: message,
    },
    { quoted: msg }
  );
};
