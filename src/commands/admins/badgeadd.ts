import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getBadgeText } from "../../db/badgeDB";
import { prefix } from "../../utils/constants";
import { getBadges, setBadges } from "../../db/membersDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const body = msg.message?.conversation;
  if (!body) {
    await reply(`❌ Body is empty!`);
    return;
  }

  const badgesList = body.trim().split("#");
  if (badgesList.length !== 3) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}badgeadd #contact #sno`
    );
    return;
  }
  const contact = badgesList[1].trim();
  const sno = Number(badgesList[2].trim());

  if (!contact || !sno) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}badgeadd #contact #sno`
    );
    return;
  }

  if (contact.length !== 12) {
    await reply(
      `❌ Give correct Indian number with country code and no spaces\nCommand: ${prefix}badgeadd #contact #sno`
    );
    return;
  }

  const getBadgeTextRes = await getBadgeText();
  if (!sno || sno < 0 || sno > getBadgeTextRes.length) {
    await reply(
      `❌ Give correct serial number within the range\nTo know the sno: ${prefix}badge`
    );
    return;
  }

  const memberjid = `${contact}@s.whatsapp.net`;
  const badgesText = getBadgeTextRes.length
    ? getBadgeTextRes[sno - 1].badge_info
    : "";

  let badges: string[];
  const getBadgeRes = await getBadges(memberjid);
  if (getBadgeRes.length && getBadgeRes[0].badges?.length) {
    if (getBadgeRes[0].badges.includes(badgesText)) {
      await reply(`❌ badge "${badgesText}" is already added to ${contact}`);
      return;
    }

    badges = getBadgeRes[0].badges;
    badges.push(badgesText);
  } else {
    badges = [badgesText];
  }

  const setBadgeRes = await setBadges(memberjid, badges);
  if (setBadgeRes) await reply(`✔ badge added!`);
  else await reply(`❌ There is some problem!`);
};

const badgeadd = () => {
  const cmd = ["badgeadd", "addbadge", "ba", "ab"];

  return { cmd, handler };
};

export default badgeadd;
