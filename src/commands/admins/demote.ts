import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { isBotGroupAdmins, reply, from } = msgInfoObj;

  if (!isBotGroupAdmins) {
    await reply("❌ I'm not Admin here!");
    return;
  }

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag someone!");
    return;
  }

  const participant = await getMentionedOrTaggedParticipant(msg);

  const response = await bot.groupParticipantsUpdate(
    from,
    [participant],
    "demote"
  );

  if (response[0].status === "200") {
    await reply("_✔ Demoted from Admin!_");
  } else {
    await reply("_❌ There is some problem!_");
  }
};

const demote = () => {
  const cmd = ["demote"];

  return { cmd, handler };
};

export default demote;
