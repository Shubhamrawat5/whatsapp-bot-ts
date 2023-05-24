import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const {
  setMilestone,
  getMilestone,
  setMilestoneText,
} = require("../../db/milestoneDB");

export const command = () => {
  let cmd = ["milestoneaddtext", "milestonetextadd", "mat", "mta"];

  return { cmd, handler };
};

//TODO: MAKE bot and reply combined, then use reply only
const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;

  if (args.length === 0) {
    await reply(`❌ Give !milestoneaddtext milestoneText`);
    return;
  }

  const milestoneText = args.join(" ");

  const res = await setMilestoneText(milestoneText);
  if (res) await reply(`✔ Milestone text added!`);
  else await reply(`❌ There is some problem!`);
};

// const handler = async (bot, msg, msgInfoObj) => {
//   const { reply, args } = msgInfoObj;

//   if (args.length <= 1) {
//     await reply(`❌ Give !milestoneadd number milestoneText`);
//     return;
//   }

//   const number = args[0];
//   if (number.length !== 12) {
//     await reply(
//       `❌ Give correct Indian number with country code\nCommand: !milestoneadd number milestoneText`
//     );
//     return;
//   }

//   const memberJid = `${number}@s.whatsapp.net`;
//   const achievedText = args.slice(1).join(" ");
//   let achieved = [achievedText];
//   const milestoneRes = await getMilestone(memberJid);
//   if (milestoneRes.length) {
//     achieved = milestoneRes[0].achieved;
//     achieved.push(achievedText);
//   }

//   const res = await setMilestone(memberJid, achieved);
//   if (res) await reply(`✔ Milestone added!`);
//   else await reply(`❌ There is some problem!`);
// };
