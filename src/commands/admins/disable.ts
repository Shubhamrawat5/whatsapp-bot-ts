import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import {
  getDisableCommand,
  setDisableCommand,
} from "../../db/disableCommandDB";
import { prefix } from "../../constants/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, allCommandsName, from } = msgInfoObj;

  if (args.length === 0) {
    await reply("❌ Give command name also by !disable commandName");
    return;
  }
  let cmd: string = args[0].toLowerCase();
  if (cmd.startsWith("!")) cmd = cmd.slice(1);

  // check if cmd is actually a command or not
  if (!allCommandsName.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is not a command!`);
    return;
  }

  const getDisableCommandRes = await getDisableCommand(from);
  const disabledCmdArray = getDisableCommandRes.length
    ? getDisableCommandRes[0].disabled
    : [];

  if (disabledCmdArray.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is already disabled!`);
    return;
  }
  disabledCmdArray.push(cmd);

  const setDisableCommandRes = await setDisableCommand(from, disabledCmdArray);

  if (setDisableCommandRes) await reply(`✔️ ${prefix}${cmd} command disabled!`);
  else await reply(`❌ There is some problem!`);
};

const disable = () => {
  const cmd = ["disable"];

  return { cmd, handler };
};

export default disable;
