import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getCountIndividual, getRankInAllGroups } from "../../db/countMemberDB";
import { getMilestones } from "../../db/membersDB";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, milestones, from } = msgInfoObj;
  let { sender } = msgInfoObj;

  if (args.length) {
    sender = `${args.join("").replace(/ |-|\(|\)/g, "")}@s.whatsapp.net`;
  } else if (msg.message?.extendedTextMessage) {
    sender = await getMentionedOrTaggedParticipant(msg);
  }

  if (sender.startsWith("+") || sender.startsWith("@")) {
    sender = sender.slice(1);
  }
  if (sender.length === 10 + 15) {
    sender = `91${sender}`;
  }

  const getRankInAllGroupsRes = await getRankInAllGroups(sender);
  if (getRankInAllGroupsRes.length === 0) {
    await reply(`❌ ERROR: ${sender.split("@")[0]} NOT FOUND in Database!`);
    return;
  }

  const { name, ranks, message_count, totalUsers } = getRankInAllGroupsRes[0];

  const res2 = await getCountIndividual(sender, from);
  const countCurGroup = res2.length ? res2[0].message_count : 0;

  // find rank
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

  let message = `${name} (#${ranks}/${totalUsers})\nRank: ${rankName}\n\n*💬 message count*\nAll PVX groups: ${message_count}\nCurrent group  : ${countCurGroup}`;

  const milestoneRes = await getMilestones(sender);

  let flag = false;
  if (milestoneRes.length) {
    flag = true;
    message += `\n`;
    milestoneRes[0].milestones.forEach((milestone: string) => {
      message += `\n⭐ ${milestone}`;
    });
  }

  if (milestones[sender]) {
    if (!flag) message += `\n`;
    milestones[sender].forEach((milestone) => {
      message += `\n⭐ ${milestone}`;
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

const rank = () => {
  const cmd = ["rank"];

  return { cmd, handler };
};

export default rank;
