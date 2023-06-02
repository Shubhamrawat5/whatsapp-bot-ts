import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getMentionedOrTaggedParticipant } from "../../functions/getParticipant";

export const remove = () => {
  const cmd = ["remove", "ban", "kick"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupAdmins, isBotGroupAdmins, reply, from } = msgInfoObj;

  if (!isBotGroupAdmins) {
    await reply("❌ I'm not Admin here!");
    return;
  }

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag someone!");
    return;
  }

  const participant = await getMentionedOrTaggedParticipant(msg);

  if (groupAdmins.includes(participant)) {
    //if admin then don't remove
    await reply("❌ Cannot remove admin!");
    return;
  }

  const response = await bot.groupParticipantsUpdate(
    from,
    [participant],
    "remove"
  );

  if (response[0].status === "200")
    await reply("_✔ Number removed from group!_");
  else await reply("_❌ There is some problem!_");
};
