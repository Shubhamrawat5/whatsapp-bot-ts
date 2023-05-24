import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const {
  getDisableCommandData,
  setDisableCommandData,
} = require("../../db/disableCommandDB");

export const command = () => {
  let cmd = ["disable"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { reply, args, allCommandsName, prefix, from } = msgInfoObj;

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

  let res = await getDisableCommandData(from);

  if (res.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is already disabled!`);
    return;
  }
  res.push(cmd);
  await setDisableCommandData(from, res);

  await reply(`✔️ ${prefix}${cmd} command disabled!`);
};
