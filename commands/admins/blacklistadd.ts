import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

const { addBlacklist } = require("../../db/blacklistDB");

export const command = () => {
  let cmd = ["blacklistadd", "addblacklist", "bla"];

  return { cmd, handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;

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

  let reason = args.slice(1).join(" ");
  if (!reason) {
    await reply(`❌ Incorrect reason!\nSend ${prefix}bla number reason`);
    return;
  }

  if (blacklistNumb.startsWith("+")) {
    blacklistNumb = blacklistNumb.slice(1);
  }
  if (blacklistNumb.length === 10) {
    blacklistNumb = "91" + blacklistNumb;
  }

  if (blacklistNumb.length !== 12) {
    await reply(
      `❌ Give correct Indian number (without spaces) with reason to add in blacklist by ${prefix}bla number reason`
    );
    return;
  }

  let blacklistRes = await addBlacklist(blacklistNumb, reason);
  await reply(blacklistRes);

  let blacklistNumbWithJid = blacklistNumb + "@s.whatsapp.net";
  let chats = await bot.groupFetchAllParticipating();
  let groups = Object.values(chats)
    .filter(
      (v: any) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>")
    )
    .map((v: any) => {
      return { subject: v.subject, id: v.id, participants: v.participants };
    });
  // console.log(groups);

  let pvxMsg = `*BLacklisted number is in following PVX groups*:\n`;

  for (let group of groups) {
    group.participants.forEach(async (mem: any) => {
      if (mem.id === blacklistNumbWithJid) {
        pvxMsg += `\n*${group.subject}*`;
      }
    });
  }

  await reply(pvxMsg);
};
