import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import {
  getDisableCommandData,
  setDisableCommandData,
} from "../../db/disableCommandDB";

export const command = () => {
  let cmd = ["enable"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { reply, args, allCommandsName, prefix, from } = msgInfoObj;

  if (args.length === 0) {
    await reply("❌ Give command name also by !enable commandName");
    return;
  }
  let cmd: string = args[0].toLowerCase();
  if (cmd.startsWith("!")) cmd = cmd.slice(1);

  //check if cmd is actually a command or not
  if (!allCommandsName.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is not a command!`);
    return;
  }

  let res = await getDisableCommandData(from);
  const disabledCmdArray = res[0].disabled;

  if (!disabledCmdArray.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is already enabled!`);
    return;
  }

  const resNew = disabledCmdArray.filter((c) => {
    return cmd != c;
  });

  await setDisableCommandData(from, resNew);

  await reply(`✔️ ${prefix}${cmd} command enabled!`);
};
