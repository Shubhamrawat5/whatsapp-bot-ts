import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";
import { getBadges, setBadges } from "../../db/membersDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const body = msg.message?.conversation;
  if (!body) {
    await reply(`❌ Body is empty!`);
    return;
  }

  const badgeList = body.trim().split("#");
  if (badgeList.length !== 3) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}badgeremove #contact #sno`
    );
    return;
  }
  const contact = badgeList[1].trim();
  const sno = Number(badgeList[2].trim());

  if (!contact || !sno) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}badgeremove #contact #sno`
    );
    return;
  }

  if (contact.length !== 12) {
    await reply(
      `❌ Give correct Indian number with country code and no spaces\nCommand: ${prefix}badgeremove #contact #sno`
    );
    return;
  }

  const memberjid = `${contact}@s.whatsapp.net`;
  const getBadgeRes = await getBadges(memberjid);

  if (getBadgeRes.length && getBadgeRes[0].badges?.length) {
    if (!sno || sno < 0 || sno > getBadgeRes[0].badges.length) {
      await reply(
        `❌ Give correct serial number within the range\nTo know the sno: ${prefix}rank`
      );
      return;
    }

    const badges = getBadgeRes[0].badges.filter(
      (badge, index) => index + 1 !== sno
    );

    const setBadgeRes = await setBadges(memberjid, badges);
    if (setBadgeRes) await reply(`✔ badge removed!`);
    else await reply(`❌ There is some problem!`);
  } else {
    await reply(`❌ There are 0 custom badges for ${contact}`);
  }
};

const badgeremove = () => {
  const cmd = ["badgeremove", "removebadge", "mr", "rm"];

  return { cmd, handler };
};

export default badgeremove;
