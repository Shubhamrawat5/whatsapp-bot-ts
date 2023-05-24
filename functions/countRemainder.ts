import { Bot } from "../interface/Bot";

export const countRemainder = async (
  bot: Bot,
  res: any,
  from: string,
  senderNumber: string,
  sender: string
) => {
  if (res.currentGroup && res.currentGroup % 5000 === 0) {
    bot.sendMessage(
      from,
      {
        text: `⭐ Hey @${senderNumber}\nYou've completed ${res.currentGroup} messages in this group!`,
        mentions: [sender],
      },
      {
        quoted: {
          key: {
            remoteJid: from,
            fromMe: false,
            id: "710B5CF29EE7471fakeid",
            participant: "0@s.whatsapp.net",
          },
          messageTimestamp: 1671784177,
          pushName: "WhatsApp",
          message: { conversation: "MESSAGE COUNT" },
        },
      }
    );
  }
  if (res.allGroup && res.allGroup % 5000 === 0) {
    bot.sendMessage(
      from,
      {
        text: `⭐ Hey @${senderNumber}\nYou've completed ${res.allGroup} messages in all PVX group!`,
        mentions: [sender],
      },
      {
        quoted: {
          key: {
            remoteJid: from,
            fromMe: false,
            id: "710B5CF29EE7471fakeid",
            participant: "0@s.whatsapp.net",
          },
          messageTimestamp: 1671784177,
          pushName: "WhatsApp",
          message: { conversation: "MESSAGE COUNT" },
        },
      }
    );
  }
};
