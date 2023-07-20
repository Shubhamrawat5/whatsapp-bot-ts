import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { setMilestoneText } from "../../db/milestoneDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;

  if (args.length === 0) {
    await reply(`❌ Give !milestoneaddtext milestoneText`);
    return;
  }

  const milestoneText = args.join(" ");

  const setMilestoneTextRes = await setMilestoneText(milestoneText);
  if (setMilestoneTextRes) await reply(`✔ Milestone text added!`);
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
//       `❌ Give correct Indian number with country code
// Command: !milestoneadd number milestoneText`
//     );
//     return;
//   }

//   const memberjid = `${number}@s.whatsapp.net`;
//   const achievedText = args.slice(1).join(" ");
//   let achieved = [achievedText];
//   const milestoneRes = await getMilestone(memberjid);
//   if (milestoneRes.length) {
//     achieved = milestoneRes[0].achieved;
//     achieved.push(achievedText);
//   }

//   const setMilestoneRes = await setMilestone(memberjid, achieved);
//   if (setMilestoneRes) await reply(`✔ Milestone added!`);
//   else await reply(`❌ There is some problem!`);
// };

const milestoneaddtext = () => {
  const cmd = ["milestoneaddtext", "milestonetextadd", "mat", "mta"];

  return { cmd, handler };
};

export default milestoneaddtext;
