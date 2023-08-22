import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { isBotGroupAdmin, reply, from, groupAdmins } = msgInfoObj;

  if (!isBotGroupAdmin) {
    await reply("❌ I'm not Admin here!");
    return;
  }

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag someone!");
    return;
  }

  const participant = await getMentionedOrTaggedParticipant(msg);

  if (groupAdmins.includes(participant)) {
    await reply("_❌ Number is already an admin!_");
    return;
  }

  const response = await bot.groupParticipantsUpdate(
    from,
    [participant],
    "promote"
  );

  if (response[0].status === "200") {
    await reply("_✔ Promoted to Admin!_");
  } else {
    await reply("_❌ There is some problem!_");
  }
};

const promote = () => {
  const cmd = ["promote"];

  return { cmd, handler };
};

export default promote;
