import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";

const {
  getDisableCommandData,
  setDisableCommandData,
} = require("../../db/disableCommandDB");

export const command = () => {
  let cmd = ["enable"];

  return { cmd, handler };
};

const handler = async (bot: any, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
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

  let res: string[] = await getDisableCommandData(from);

  if (!res.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is already enabled!`);
    return;
  }

  //TODO: RETURN TYPE IN ALL FUNCTIONS
  const resNew: string[] = res.filter((c: string) => {
    return cmd != c;
  });

  await setDisableCommandData(from, resNew);

  await reply(`✔️ ${prefix}${cmd} command enabled!`);
};
