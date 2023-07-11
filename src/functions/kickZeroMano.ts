import { GroupMetadata } from "@whiskeysockets/baileys";
import { LoggerBot } from "./loggerBot";
import { Bot } from "../interface/Bot";
import { getCountVideo } from "../db/countVideoDB";

const kickZeroMano = async (bot: Bot, pvxmano: string) => {
  try {
    const getCountVideoRes = await getCountVideo(pvxmano);

    const memWithMsg = new Set();
    getCountVideoRes.forEach((member) => {
      memWithMsg.add(member.memberjid);
    });

    const groupMetadata: GroupMetadata = await bot.groupMetadata(pvxmano);
    const groupMembers = groupMetadata.participants;

    const zeroMano: string[] = [];
    groupMembers.forEach((mem) => {
      if (!memWithMsg.has(mem.id)) {
        zeroMano.push(mem.id);
      }
    });

    const randomMemId = zeroMano[Math.floor(Math.random() * zeroMano.length)];
    const numSplit = `${randomMemId.split("@s.whatsapp.net")[0]}`;

    console.log(`Removing ${randomMemId} from Mano.`);
    await bot.sendMessage(pvxmano, {
      text: `Removing  @${numSplit}\nReason: 0 videos count! `,
      mentions: [randomMemId],
    });
    await bot.groupParticipantsUpdate(pvxmano, [randomMemId], "remove");

    // randomMemId = zeroMano[Math.floor(Math.random() * zeroMano.length)];
    // numSplit = `${randomMemId.split("@s.whatsapp.net")[0]}`;
    // console.log(`Removing ${randomMemId} from Mano.`);
    // await bot.sendMessage(pvxmano, {
    //   text: `Removing  @${numSplit}\nReason: 0 videos count! `,
    //   mentions: [randomMemId],
    // });
    // await bot.groupParticipantsUpdate(pvxmano, [randomMemId], "remove");
  } catch (err) {
    await LoggerBot(bot, "KICK-MANO", err, undefined);
  }
};

export default kickZeroMano;
