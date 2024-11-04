import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getPvxClanDetails } from "../../utils/coc/apis";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const clanDetails = await getPvxClanDetails();

  let response = `🛡️ *${clanDetails.name}*\n ${clanDetails.currentMembersCount}/50\n\n`;

  response += `🏷️ *Tag:* ${clanDetails.tag}\n`;
  response += `🚪 *Type:* ${clanDetails.joinType}\n`;
  response += `📝 *Description:* ${clanDetails.description}\n`;
  response += `📍 *Location:* ${clanDetails.location.name}\n`;
  response += `👥 *Members:* ${clanDetails.members}\n`;
  response += `⭐ *Clan Level:* ${clanDetails.clanLevel}\n`;
  response += `⚔️ *War Frequency:* ${clanDetails.warFrequency}\n`;
  response += `🏆 *War Win Streak:* ${clanDetails.warWinStreak}\n`;
  response += `📈 *War League:* ${clanDetails.warLeague.name}\n`;

  await reply(response.trim());
};

const clan = () => {
  const cmd = ["clan", "cocclan"];
  return { cmd, handler };
};

export default clan;
