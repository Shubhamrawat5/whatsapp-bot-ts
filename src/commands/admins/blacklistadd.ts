import { GroupParticipant, WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { addBlacklist } from "../../db/blacklistDB";
import { prefix, pvxgroups } from "../../utils/constants";
import { Chats } from "../../interfaces/Chats";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, sender } = msgInfoObj;

  if (args.length < 2) {
    await reply(`❌ Wrong query!\nSend ${prefix}bla number reason`);
    return;
  }

  let blacklistNumb = args[0];
  if (!Number(blacklistNumb)) {
    await reply(
      `❌ Give correct Indian number (without spaces) with reason to add in blacklist by ${prefix}bla number reason`
    );
    return;
  }

  const reason = args.slice(1).join(" ");
  if (!reason) {
    await reply(`❌ Incorrect reason!\nSend ${prefix}bla number reason`);
    return;
  }

  if (blacklistNumb.startsWith("+")) {
    blacklistNumb = blacklistNumb.slice(1);
  }
  if (blacklistNumb.length === 10) {
    blacklistNumb = `91${blacklistNumb}`;
  }

  if (blacklistNumb.length !== 12) {
    await reply(
      `❌ Give correct Indian number (without spaces) with reason to add in blacklist by ${prefix}bla number reason`
    );
    return;
  }
  const blacklistNumbWithJid = `${blacklistNumb}@s.whatsapp.net`;

  const chats: Chats = await bot.groupFetchAllParticipating();

  let isSenderMainAdmin = false;
  chats[pvxgroups.pvxadmin]?.participants.forEach((member) => {
    if (member.id === sender) {
      isSenderMainAdmin = true;
    }
  });

  if (!isSenderMainAdmin) {
    await reply(`❌ Only MAIN PVX ADMIN can add in blacklist!`);
    return;
  }

  const addBlacklistRes = await addBlacklist(
    blacklistNumbWithJid,
    reason,
    sender
  );
  if (addBlacklistRes) await reply("✔️ Added to blacklist!");
  else await reply("❌ There is some problem or Number is already blacklisted");

  const groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>"))
    .map((v) => ({
      subject: v.subject,
      id: v.id,
      participants: v.participants,
    }));

  let pvxMsg = `*Blacklisted number is in following PVX groups*:\n`;

  groups.forEach((group) => {
    group.participants.forEach(async (member: GroupParticipant) => {
      if (member.id === blacklistNumbWithJid) {
        pvxMsg += `\n*${group.subject}*`;
      }
    });
  });

  await reply(pvxMsg);
};

const blacklistadd = () => {
  const cmd = ["blacklistadd", "addblacklist", "bla"];

  return { cmd, handler };
};

export default blacklistadd;
