import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { addDonation } from "../../db/donationDB";

export const command = () => {
  let cmd = ["donationadd", "da"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;
  let body = msg.message?.conversation;
  if (!body) {
    await reply(`❌ Body is empty!`);
    return;
  }

  if (args.length == 0) {
    await reply(`❌ Error! Add by ${prefix}adddonation #name #number #amount`);
    return;
  }

  // let donaList = body.trim().replace(/ +/, ",").split(",")[1].split("#");
  let donaList = body.trim().split("#");
  //[!adddonation, name, number, amount] = 4
  if (donaList.length != 4) {
    await reply(`❌ Error! Add by ${prefix}adddonation #name #number #amount`);
    return;
  }
  let name = donaList[1].trim().toLowerCase();
  let number = Number(donaList[2].trim());
  let amount = Number(donaList[3].trim());

  console.log(`name: ${name}, number: ${number}, amount: ${amount}`);

  if (name && number && amount) {
    let addDonaRes = await addDonation(name, number, amount);
    if (addDonaRes) await reply("✔️ Added!");
    else await reply("❌ Error!");
  } else
    await reply(`❌ Error! Add by ${prefix}adddonation #name #number #amount`);
};
