import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

export const command = () => {
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

  // console.log(msg);
  /*
      1) when !ban OR !ban xyz
         message:{ conversation: '!ban' }
      2) when !ban tagMember
          message: Message {
            extendedTextMessage: ExtendedTextMessage {
              text: '.ban @91745cccccc',
              previewType: 0,
              contextInfo: [ContextInfo],
              inviteLinkGroupType: 0
           }
         }

      3) when !ban tagMessage
          message: {
              extendedTextMessage: {
                text: '.ban',
                previewType: 'NONE',
                contextInfo: [Object],
                inviteLinkGroupType: 'DEFAULT'
             }
          }
  */

  const mentioned = msg.message.extendedTextMessage.contextInfo?.mentionedJid;
  if (mentioned && mentioned.length) {
    //when member are mentioned with command
    if (mentioned.length === 1) {
      if (groupAdmins.includes(mentioned[0])) {
        //if admin then don't remove
        await reply("❌ Cannot remove admin!");
        return;
      }
      const response = await bot.groupParticipantsUpdate(
        from,
        mentioned,
        "remove"
      );
      if (response[0].status === "200")
        await reply("_✔ Number removed from group!_");
      else await reply("_❌ There is some problem!_");
    } else {
      //if multiple members are tagged
      await reply("❌ Mention only 1 member!");
    }
  } else {
    //when message is tagged with command
    //TODO: MAKE A COMMON FUNCTION
    const participant =
      msg.message.extendedTextMessage.contextInfo?.participant;
    if (!participant) return;
    const taggedMessageUser = [participant];

    if (participant && groupAdmins.includes(participant)) {
      //if admin then don't remove
      await reply("❌ Cannot remove admin!");
      return;
    }
    const response = await bot.groupParticipantsUpdate(
      from,
      taggedMessageUser,
      "remove"
    );
    if (response[0].status === "200")
      await reply("_✔ Number removed from group!_");
    else await reply("_❌ There is some problem!_");
  }
};
