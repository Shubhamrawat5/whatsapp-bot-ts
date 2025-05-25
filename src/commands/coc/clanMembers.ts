import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getPvxClanMembers } from "../../utils/coc/apis";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  let response = `CLAN MEMBERS:\n\n`;

  const clanMembers = await getPvxClanMembers();
  clanMembers.forEach((member, index) => {
    response += `${index + 1}. *${member.name}*\n`;
    response += `🏆 Trophies: ${member.trophies}\n`;
    response += `🏅 Donations: ${member.donations}\n`;
    response += `👥 Clan Rank: ${member.clanRank}\n`;
    response += `👥 Player Role: ${member.role}\n\n`;
  });

  await reply(response.trim());
};

const clanmembers = () => {
  const cmd = ["clanmembers", "cocclanmembers"];
  return { cmd, handler };
};

export default clanmembers;
