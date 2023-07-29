import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const text = `_*🗣️ VOTING COMMANDS:*_

📛 *${prefix}startvote #title #name1 #name2..*
  - _Start voting with seperated values with #_

📛 *${prefix}vote number*
  - _To vote for particular number!_

📛 *${prefix}checkvote*
  - _Status of current ongoing voting!_
      Alias: ${prefix}cv
      
📛 *${prefix}stopvote*
  - _Stop voting and see final result!_`;

  await reply(text);
};

const votecommand = () => {
  const cmd = ["votecommand", "vc"];

  return { cmd, handler };
};

export default votecommand;
