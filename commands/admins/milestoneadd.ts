import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import {
  getMilestoneText,
  getMilestone,
  setMilestone,
} from "../../db/milestoneDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, prefix } = msgInfoObj;

  const body = msg.message?.conversation;
  if (!body) {
    await reply(`❌ Body is empty!`);
    return;
  }

  const milestoneList = body.trim().split("#");
  if (milestoneList.length !== 3) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}milestoneadd #contact #sno`
    );
    return;
  }
  const contact = milestoneList[1].trim();
  const sno = Number(milestoneList[2].trim());

  if (!contact || !sno) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}milestoneadd #contact #sno`
    );
    return;
  }

  if (contact.length !== 12) {
    await reply(
      `❌ Give correct Indian number with country code and no spaces\nCommand: ${prefix}milestoneadd #contact #sno`
    );
    return;
  }

  const getMilestoneTextRes = await getMilestoneText();
  if (!sno || sno < 0 || sno > getMilestoneTextRes.length) {
    await reply(
      `❌ Give correct serial number within the range\nTo know the sno: ${prefix}milestone`
    );
    return;
  }

  const memberjid = `${contact}@s.whatsapp.net`;
  const achievedText = getMilestoneTextRes.length
    ? getMilestoneTextRes[sno - 1].milestone
    : "";

  let achieved: string[];
  const getMilestoneRes = await getMilestone(memberjid);
  if (getMilestoneRes.length) {
    if (getMilestoneRes[0].achieved.includes(achievedText)) {
      await reply(
        `❌ Milestone "${achievedText}" is already added to ${contact}`
      );
      return;
    }

    achieved = getMilestoneRes[0].achieved;
    achieved.push(achievedText);
  } else {
    achieved = [achievedText];
  }

  const setMilestoneRes = await setMilestone(memberjid, achieved);
  if (setMilestoneRes) await reply(`✔ Milestone added!`);
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

const milestoneadd = () => {
  const cmd = ["milestoneadd", "addmilestone", "ma", "am"];

  return { cmd, handler };
};

export default milestoneadd;
