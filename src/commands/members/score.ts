import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCricketScore } from "../../functions/cricket";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupDesc, reply, from } = msgInfoObj;
  const descErrorMessage = `❌ ERROR
- Group description is empty.
- Put match ID in starting of group description. 
- Get match ID from cricbuzz today match url.
- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
- so match ID is 37572 !
# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`;

  if (!groupDesc) {
    await reply(descErrorMessage);
    return;
  }

  const matchId = groupDesc.slice(0, 5);
  if (Number.isNaN(Number(matchId))) {
    await reply(descErrorMessage);
    return;
  }

  const response = await getCricketScore(matchId);

  await bot.sendMessage(from, { text: response }, { quoted: msg });
};

const score = () => {
  const cmd = ["score"];

  return { cmd, handler };
};

export default score;
