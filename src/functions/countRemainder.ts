import { SetCountMember } from "../db/countMemberDB";
import { Bot } from "../interfaces/Bot";

const countRemainder = async (
  bot: Bot,
  SetCountMemberRes: SetCountMember,
  from: string,
  senderNumber: string,
  sender: string
) => {
  const quotedCustomMessage = {
    key: {
      remoteJid: from,
      fromMe: false,
      id: "710B5CF29EE7471fakeid",
      participant: "0@s.whatsapp.net",
    },
    messageTimestamp: 1671784177,
    pushName: "WhatsApp",
    message: { conversation: "MESSAGE COUNT" },
  };

  if (
    SetCountMemberRes.currentGroup &&
    SetCountMemberRes.currentGroup % 5000 === 0
  ) {
    await bot.sendMessage(
      from,
      {
        text: `⭐ Hey @${senderNumber}\nYou've completed ${SetCountMemberRes.currentGroup} messages in this group!`,
        mentions: [sender],
      },
      {
        quoted: quotedCustomMessage,
      }
    );
  }
  if (SetCountMemberRes.allGroup && SetCountMemberRes.allGroup % 5000 === 0) {
    await bot.sendMessage(
      from,
      {
        text: `⭐ Hey @${senderNumber}\nYou've completed ${SetCountMemberRes.allGroup} messages in all PVX group!`,
        mentions: [sender],
      },
      {
        quoted: quotedCustomMessage,
      }
    );
  }
};

export default countRemainder;
