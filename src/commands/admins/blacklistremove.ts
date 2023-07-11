import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getBlacklist, removeBlacklist } from "../../db/blacklistDB";
import { prefix, pvxgroups } from "../../constants/constants";
import { Chats } from "../../functions/addDefaultMilestone";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, sender } = msgInfoObj;
  let blacklistNumb = args[0];
  if (!Number(blacklistNumb)) {
    await reply(
      `❌ Give correct Indian number (without spaces) to remove from blacklist by ${prefix}blr number`
    );
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
      `❌ Give correct Indian number (without spaces) to remove from blacklist by ${prefix}blr number`
    );
    return;
  }

  const getBlacklistRes = await getBlacklist(blacklistNumb);
  if (getBlacklistRes.length === 0) {
    await reply(`❌ Number is not blacklisted`);
    return;
  }

  if (getBlacklistRes[0].admin) {
    // admin exist, check if sender is same as the admin in DB
    if (getBlacklistRes[0].admin === sender) {
      const removeBlacklistRes = await removeBlacklist(blacklistNumb);
      await reply(removeBlacklistRes);
      return;
    }
    let message = `Only the admin who added in blacklist can remove!`;
    if (getBlacklistRes[0].adminname) {
      message += `\nGiven by ${getBlacklistRes[0].adminname}`;
    }
    await reply(message);
    return;
  }

  // admin doesn't exist in DB, check if sender is main admin or not
  const chats: Chats = await bot.groupFetchAllParticipating();

  let isSenderMainAdmin = false;
  chats[pvxgroups.pvxsubadmin].participants.forEach((member) => {
    if (member.id === sender) {
      isSenderMainAdmin = true;
    }
  });

  if (!isSenderMainAdmin) {
    await reply(`❌ Only MAIN PVX ADMIN can add in blacklist!`);
    return;
  }

  const removeBlacklistRes = await removeBlacklist(blacklistNumb);
  await reply(removeBlacklistRes);
};

const blacklistremove = () => {
  const cmd = ["blacklistremove", "removeblacklist", "blr"];

  return { cmd, handler };
};

export default blacklistremove;
