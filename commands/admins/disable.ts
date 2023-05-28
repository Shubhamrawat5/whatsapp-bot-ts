import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import {
  getDisableCommandData,
  setDisableCommandData,
} from "../../db/disableCommandDB";

export const command = () => {
  const cmd = ["disable"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, allCommandsName, prefix, from } = msgInfoObj;

  if (args.length === 0) {
    await reply("❌ Give command name also by !disable commandName");
    return;
  }
  let cmd: string = args[0].toLowerCase();
  if (cmd.startsWith("!")) cmd = cmd.slice(1);

  //check if cmd is actually a command or not
  if (!allCommandsName.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is not a command!`);
    return;
  }

  const res = await getDisableCommandData(from);

  //TODO: CHECK RES LENGTH
  const disabledCmdArray = res[0].disabled;

  if (disabledCmdArray.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is already disabled!`);
    return;
  }
  disabledCmdArray.push(cmd);
  //TODO: ADD VARIABLE RESPONSE IN ALL
  await setDisableCommandData(from, disabledCmdArray);

  await reply(`✔️ ${prefix}${cmd} command disabled!`);
};
