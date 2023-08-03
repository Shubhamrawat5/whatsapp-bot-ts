import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { botNumberJid, reply, isSenderGroupAdmin, isBotGroupAdmin, from } =
    msgInfoObj;

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag message to delete.");
    return;
  }

  // bot message, anyone can delete
  if (
    msg.message.extendedTextMessage.contextInfo?.participant === botNumberJid
  ) {
    // await reply("❌ Tag message of bot to delete.");

    // Message with tagged user, links has (.quotedMessage.extendedTextMessage.text)
    // non tagged has (.quotedMessage.conversation)
    const { quotedMessage } = msg.message.extendedTextMessage.contextInfo;
    if (
      quotedMessage?.extendedTextMessage?.text?.includes("Birthday") ||
      quotedMessage?.extendedTextMessage?.text?.includes("Welcome") ||
      quotedMessage?.conversation?.includes("📰") ||
      quotedMessage?.conversation?.includes("Rank")
    ) {
      await reply("❌ Cannot delete this message.");
    } else {
      const options = {
        remoteJid: botNumberJid,
        fromMe: true,
        id: msg.message.extendedTextMessage.contextInfo.stanzaId,
      };
      await bot.sendMessage(from, {
        delete: options,
      });
    }
    return;
  }

  // member message, only admin can delete
  if (!isBotGroupAdmin) {
    await reply("❌ I'm not admin to delete message for everyone.");
    return;
  }

  if (isSenderGroupAdmin) {
    const options = {
      remoteJid: from,
      fromMe: false,
      id: msg.message.extendedTextMessage.contextInfo?.stanzaId,
      participant: msg.message.extendedTextMessage.contextInfo?.participant,
    };
    await bot.sendMessage(from, {
      delete: options,
    });
  } else {
    await reply("❌ Only admin can delete member's message.");
  }
};

const deletee = () => {
  const cmd = ["delete", "d"];

  return { cmd, handler };
};

export default deletee;
