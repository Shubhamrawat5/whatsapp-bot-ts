import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

// const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
//   const { isBotGroupAdmin, reply, args, from } = msgInfoObj;

//   if (!isBotGroupAdmin) {
//     await reply("❌ I'm not Admin here!");
//     return;
//   }

//   let num: string;
//   if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
//     // member's message is tagged to add
//     num = msg.message.extendedTextMessage.contextInfo.participant;
//   } else {
//     // number is given like !add 919557---82
//     if (args.length === 0) {
//       await reply("❌ Give number to add!");
//       return;
//     }
//     num = `${args.join("").replace(/ |-|\(|\)/g, "")}@s.whatsapp.net`; // remove spaces , ( , ) and -
//     if (num.startsWith("+")) {
//       // remove + sign from starting if given
//       num = num.slice(1);
//     }
//   }

//   interface Response {
//     status: string;
//     jid: string;
//   }
//   let response: Response[] | undefined;

//   try {
//     response = await bot.groupParticipantsUpdate(from, [num], "add");
//   } catch (err) {
//     console.log(err);
//     if (err instanceof Error) {
//       await reply(
//         `_❌ Check the number, include country code also!_\nError: ${err.toString()}`
//       );
//     }
//     return;
//   }

//   if (response === undefined) {
//     await reply(`_❌ There is some problem_`);
//     return;
//   }

//   const status = Number(response[0].status);
//   if (status === 400) {
//     await reply("_❌ Invalid number, include country code also!_");
//   } else if (status === 403) {
//     await reply("_❌ Number has privacy on adding group!_");
//   } else if (status === 408) {
//     await reply("_❌ Number has left the group recently!_");
//   } else if (status === 409) {
//     await reply("_❌ Number is already in group!_");
//   } else if (status === 500) {
//     await reply("_❌ Group is currently full!_");
//   } else if (status === 200) {
//     await reply("_✔ Number added to group!_");
//   }
// };

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  await reply("Command temperory disabled!");
};

const add = () => {
  const cmd = ["add"];

  return { cmd, handler };
};

export default add;
