import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getMilestone, setMilestone } from "../../db/milestoneDB";

export const command = () => {
  let cmd = ["milestoneremove", "removemilestone", "mr", "rm"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, prefix } = msgInfoObj;

  let body = msg.message?.conversation;
  if (!body) {
    await reply(`❌ Body is empty!`);
    return;
  }

  let milestoneList = body.trim().split("#");
  if (milestoneList.length !== 3) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}milestoneremove #contact #sno`
    );
    return;
  }
  let contact = milestoneList[1].trim();
  let sno = Number(milestoneList[2].trim());

  if (!contact || !sno) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}milestoneremove #contact #sno`
    );
    return;
  }

  if (contact.length !== 12) {
    await reply(
      `❌ Give correct Indian number with country code and no spaces\nCommand: ${prefix}milestoneremove #contact #sno`
    );
    return;
  }

  const memberjid = `${contact}@s.whatsapp.net`;
  const milestoneRes = await getMilestone(memberjid);

  if (milestoneRes.length === 0) {
    await reply(`❌ There are 0 custom milestones for ${contact}`);
    return;
  }
  if (!sno || sno < 0 || sno > milestoneRes[0].achieved.length) {
    await reply(
      `❌ Give correct serial number within the range\nTo know the sno: ${prefix}rank`
    );
    return;
  }

  let achieved = milestoneRes[0].achieved.filter((milestone, index) => {
    return index + 1 !== sno;
  });

  const res = await setMilestone(memberjid, achieved);
  if (res) await reply(`✔ Milestone removed!`);
  else await reply(`❌ There is some problem!`);
};

// const handler = async (bot, msg, msgInfoObj) => {
//   const { reply, args } = msgInfoObj;

//   if (args.length === 0) {
//     await reply(`❌ Give !milestoneaddtext milestoneText`);
//     return;
//   }

//   const milestoneText = args.join(" ");

//   const res = await setMilestoneText(milestoneText);
//   if (res) await reply(`✔ Milestone text added!`);
//   else await reply(`❌ There is some problem!`);
// };
