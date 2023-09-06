import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupAdmins, isBotGroupAdmin, reply, from } = msgInfoObj;

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
    await reply("❌ Cannot remove admin!");
    return;
  }

  const response = await bot.groupParticipantsUpdate(
    from,
    [participant],
    "remove"
  );

  if (response[0].status === "200") {
    await reply("_✔ Number removed from group!_");
  } else {
    await reply("_❌ There is some problem!_");
  }
};

const remove = () => {
  const cmd = ["remove", "ban", "kick"];

  return { cmd, handler };
};

export default remove;
