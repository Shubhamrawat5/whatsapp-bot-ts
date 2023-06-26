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
    await reply("❌ Give command name also by !enable commandName");
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

  if (!disabledCmdArray.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is already enabled!`);
    return;
  }

  const resNew = disabledCmdArray.filter((c) => cmd !== c);

  const setDisableCommandRes = await setDisableCommand(from, resNew);

  if (setDisableCommandRes) await reply(`✔️ ${prefix}${cmd} command enabled!`);
  else await reply(`❌ There is some problem!`);
};

const enable = () => {
  const cmd = ["enable"];

  return { cmd, handler };
};

export default enable;
