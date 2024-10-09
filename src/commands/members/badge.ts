import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getBadgeText } from "../../db/badgeDB";
import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  let message = `*─「 <{PVX}> badges 」 ─*

Send ${prefix}rank to know your rank with badges.${readMore}

 *[Default Badges]*
⭐ Main Admin of PVX
⭐ Sub-Admin of PVX
⭐ Most active member of PVX
⭐ Top 10 active member of PVX
⭐ Top 50 active member of PVX
⭐ Top 100 active member of PVX
⭐ Highest contribution in PVX funds
⭐ Huge Contribution in PVX funds
⭐ Contribution in PVX funds`;

  const getBadgeTextRes = await getBadgeText();
  if (getBadgeTextRes.length) {
    message += `\n\n *[CUSTOM BADGES]*\nAdmin can give following badges by ${prefix}badgeadd #contact #sno\nEg: ${prefix}badgeadd #919876.... #2`;
    getBadgeTextRes.forEach((badgeRes, index) => {
      message += `\n⭐ ${index + 1}. ${badgeRes.badge_info}`;
    });
  }

  await reply(message);
};

const badge = () => {
  const cmd = ["badge", "badges"];

  return { cmd, handler };
};

export default badge;
