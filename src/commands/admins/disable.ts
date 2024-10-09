import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getGroupData, setDisableCommand } from "../../db/pvxGroupDB";
import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args, allCommandsName, groupName, from } = msgInfoObj;

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

  const getDisableCommandRes = await getGroupData(from);
  const disabledCmdArray =
    getDisableCommandRes.length && getDisableCommandRes[0].commands_disabled
      ? getDisableCommandRes[0].commands_disabled
      : [];

  if (disabledCmdArray.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is already disabled!`);
    return;
  }
  disabledCmdArray.push(cmd);

  const setDisableCommandRes = await setDisableCommand(
    from,
    groupName ?? "Not Found",
    disabledCmdArray
  );

  if (setDisableCommandRes) await reply(`✔️ ${prefix}${cmd} command disabled!`);
  else await reply(`❌ There is some problem!`);
};

const disable = () => {
  const cmd = ["disable"];

  return { cmd, handler };
};

export default disable;
