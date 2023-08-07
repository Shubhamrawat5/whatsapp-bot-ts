import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getMilestoneText } from "../../db/milestoneDB";
import { prefix } from "../../utils/constants";
import { getMilestones, setMilestones } from "../../db/membersDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const body = msg.message?.conversation;
  if (!body) {
    await reply(`❌ Body is empty!`);
    return;
  }

  const milestonesList = body.trim().split("#");
  if (milestonesList.length !== 3) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}milestoneadd #contact #sno`
    );
    return;
  }
  const contact = milestonesList[1].trim();
  const sno = Number(milestonesList[2].trim());

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
  const milestonesText = getMilestoneTextRes.length
    ? getMilestoneTextRes[sno - 1].milestone
    : "";

  let milestones: string[];
  const getMilestoneRes = await getMilestones(memberjid);
  if (getMilestoneRes.length && getMilestoneRes[0].milestones?.length) {
    if (getMilestoneRes[0].milestones.includes(milestonesText)) {
      await reply(
        `❌ Milestone "${milestonesText}" is already added to ${contact}`
      );
      return;
    }

    milestones = getMilestoneRes[0].milestones;
    milestones.push(milestonesText);
  } else {
    milestones = [milestonesText];
  }

  const setMilestoneRes = await setMilestones(memberjid, milestones);
  if (setMilestoneRes) await reply(`✔ Milestone added!`);
  else await reply(`❌ There is some problem!`);
};

const milestoneadd = () => {
  const cmd = ["milestoneadd", "addmilestone", "ma", "am"];

  return { cmd, handler };
};

export default milestoneadd;
