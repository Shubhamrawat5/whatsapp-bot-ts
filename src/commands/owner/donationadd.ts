import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";
import { setDonation } from "../../db/membersDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;
  const body = msg.message?.conversation;
  if (!body) {
    await reply(`❌ Body is empty!`);
    return;
  }

  const errorMessage = `❌ Error! Add by ${prefix}adddonation #number #amount`;
  if (args.length === 0) {
    await reply(errorMessage);
    return;
  }

  // let donaList = body.trim().replace(/ +/, ",").split(",")[1].split("#");
  const donationList = body.trim().split("#");

  // [!adddonation, number, amount] = 3
  if (donationList.length !== 3) {
    await reply(errorMessage);
    return;
  }
  const number = donationList[1].trim();
  const amount = Math.trunc(Number(donationList[2].trim()));

  // console.log(`number: ${number}, amount: ${amount}`);
  if (number && number.length === 12 && amount && amount > 0) {
    const numberWithJid = `${number}@s.whatsapp.net`;
    const addDonationRes = await setDonation(numberWithJid, amount, number);
    if (addDonationRes) await reply("✔️ Added!");
    else await reply(`❌ There is some problem!`);
  } else {
    await reply(errorMessage);
  }
};

const donationadd = () => {
  const cmd = ["donationadd", "da"];

  return { cmd, handler };
};

export default donationadd;
