import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getGroupData, setExpertCommand } from "../../db/pvxGroupDB";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, groupName, from } = msgInfoObj;

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag someone!");
    return;
  }

  const participant = await getMentionedOrTaggedParticipant(msg);

  const getGroupDataRes = await getGroupData(from);
  const expertArray =
    getGroupDataRes.length && getGroupDataRes[0].expert
      ? getGroupDataRes[0].expert
      : [];

  if (expertArray.includes(participant)) {
    await reply(`❌ Already an expert!`);
    return;
  }
  expertArray.push(participant);

  const setDisableCommandRes = await setExpertCommand(
    from,
    groupName ?? "Not Found",
    expertArray
  );

  if (setDisableCommandRes) await reply(`✔️ Expert added!`);
  else await reply(`❌ There is some problem!`);
};

const expertadd = () => {
  const cmd = ["expertadd", "addexpert"];

  return { cmd, handler };
};

export default expertadd;
