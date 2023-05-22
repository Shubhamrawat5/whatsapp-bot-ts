import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

export const command = () => {
  let cmd = ["votecommand", "vc"];

  return { cmd, handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { prefix, reply } = msgInfoObj;
  let text = `_*🗣️ VOTING COMMANDS:*_

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
