import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCountIndividual, getRankInAllGroups } from "../../db/countMemberDB";
import { getBadges } from "../../db/membersDB";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, defaultBadges, from, sender } = msgInfoObj;

  let participant: string;

  if (args.length) {
    participant = `${args.join("").replace(/ |-|\(|\)/g, "")}@s.whatsapp.net`;
  } else if (msg.message?.extendedTextMessage) {
    participant = await getMentionedOrTaggedParticipant(msg);
  } else {
    participant = sender;
  }

  if (participant.startsWith("+") || participant.startsWith("@")) {
    participant = participant.slice(1);
  }
  if (participant.length === 10 + 15) {
    participant = `91${participant}`;
  }

  const getRankInAllGroupsRes = await getRankInAllGroups(participant);
  if (getRankInAllGroupsRes.length === 0) {
    await reply(
      `❌ ERROR: ${participant.split("@")[0]} NOT FOUND in Database!`
    );
    return;
  }

  const { name, ranks, messageCount, totalUsers } = getRankInAllGroupsRes[0];

  const res2 = await getCountIndividual(participant, from);
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

  let message = `${name} (#${ranks}/${totalUsers})\nRank: ${rankName}\n\n*💬 message count*\nAll PVX groups: ${messageCount}\nCurrent group  : ${countCurGroup}`;

  const getBadgeRes = await getBadges(participant);

  let flag = false;
  if (getBadgeRes.length && getBadgeRes[0].badges?.length) {
    flag = true;
    message += `\n`;
    getBadgeRes[0].badges.forEach((badge: string) => {
      message += `\n⭐ ${badge}`;
    });
  }

  if (defaultBadges[participant]) {
    if (!flag) message += `\n`;
    defaultBadges[participant].forEach((badge) => {
      message += `\n⭐ ${badge}`;
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
