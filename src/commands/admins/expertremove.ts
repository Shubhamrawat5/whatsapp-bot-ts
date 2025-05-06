import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getGroupData, setExpert } from "../../db/pvxGroupDB";
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

  if (!expertArray.includes(participant)) {
    await reply(`❌ Not an expert!`);
    return;
  }
  const resNew = expertArray.filter((c) => participant !== c);

  const setDisableCommandRes = await setExpert(
    from,
    groupName ?? "Not Found",
    resNew
  );

  if (setDisableCommandRes) await reply(`✔️ Expert removed!`);
  else await reply(`❌ There is some problem!`);
};

const expertremove = () => {
  const cmd = ["expertremove", "removeexpert"];

  return { cmd, handler };
};

export default expertremove;
