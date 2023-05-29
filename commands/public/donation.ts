import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import fs from "fs";
import { getDonation } from "../../db/donationDB";

export const donation = () => {
  const cmd = ["donation", "donations", "donate"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from } = msgInfoObj;
  // const more = String.fromCharCode(8206);
  // const readMore = more.repeat(4001);

  const donaResult = await getDonation();
  // console.log(donaResult);
  let totalDona = 0;
  let donaMsgTemp = "";
  donaResult.forEach((dona) => {
    totalDona += dona.amount;
    donaMsgTemp += `\n❤️ Rs ${dona.amount} - ${dona.name}`;
  });

  let donaMsg = `Helping PVX COMMUNITY to grow and provide good stuff for all members.\nUse cases: domain name for PVX website, giveaways, tournaments in future, server for all bots and website, etc etc.\n\n*Any amount is appreciated.*\n\nUPI: shubhamraw123@okhdfcbank , shubhamraw123@okaxis\n\nAfter sending donation, take a screenshot and send to https://wa.me/916397867115 with your name. [Your name will be shown here after that]\n\n*Total Donations: Rs ${totalDona}*`;

  donaMsg += donaMsgTemp;

  await bot.sendMessage(
    from,
    {
      image: fs.readFileSync(__dirname + "/../../assert/donation.jpg"),
      caption: donaMsg,
    },
    { quoted: msg }
  );
};
