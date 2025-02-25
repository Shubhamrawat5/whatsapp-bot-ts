import { WAMessage } from "@whiskeysockets/baileys";
import fs from "fs";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

import { getDonation } from "../../db/membersDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from } = msgInfoObj;
  // const more = String.fromCharCode(8206);
  // const readMore = more.repeat(4001);

  const getDonationRes = await getDonation();
  // console.log(getDonationRes);
  let totalDona = 0;
  let donaMsgTemp = "";
  getDonationRes.forEach((dona) => {
    totalDona += dona.donation;
    donaMsgTemp += `\n❤️ Rs ${dona.donation} - ${dona.name}`;
  });

  let donaMsg = `Helping PVX COMMUNITY to grow and provide good stuff for all members.\nUse cases: domain name for PVX website, giveaways, tournaments in future, server for all bots and website, etc etc.\n\n*Any amount is appreciated.*\n\nUPI: shubhamraw123@okhdfcbank , shubhamraw123@okaxis\n\nAfter sending donation, take a screenshot and send to https://wa.me/919353804615 with your name. [Your name will be shown here after that]\n\n*Total Donations: Rs ${totalDona}*`;

  donaMsg += donaMsgTemp;

  await bot.sendMessage(
    from,
    {
      image: fs.readFileSync(`${__dirname}/../../../asset/donation.jpg`),
      caption: donaMsg,
    },
    { quoted: msg }
  );
};

const donation = () => {
  const cmd = ["donation", "donations", "donate"];

  return { cmd, handler };
};

export default donation;
