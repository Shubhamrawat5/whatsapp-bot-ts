import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from } = msgInfoObj;
  const text = `_*🏏  CRICKET COMMANDS:*_

- Put matchID in starting of group description.
- Get match ID from cricbuzz today match url.
- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
- so match ID is 37572 !

📛 *${prefix}score*
  - _current score of match!_
📛 *${prefix}scorecard*
  - _current scorecard of players!_
    Alias: ${prefix}sc ${prefix}sb
📛 *${prefix}startc*
  - _start match live score every 1 min!_
📛 *${prefix}stopc*
  - _Stop match live score!_`;

  await bot.sendMessage(from, { text }, { quoted: msg });
};

const cricketcommand = () => {
  const cmd = ["cricketcommand", "cc"];

  return { cmd, handler };
};

export default cricketcommand;
