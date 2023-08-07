import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";
import { getMilestones, setMilestones } from "../../db/membersDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const body = msg.message?.conversation;
  if (!body) {
    await reply(`❌ Body is empty!`);
    return;
  }

  const milestoneList = body.trim().split("#");
  if (milestoneList.length !== 3) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}milestoneremove #contact #sno`
    );
    return;
  }
  const contact = milestoneList[1].trim();
  const sno = Number(milestoneList[2].trim());

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
  const getMilestoneRes = await getMilestones(memberjid);

  if (getMilestoneRes.length && getMilestoneRes[0].milestones?.length) {
    if (!sno || sno < 0 || sno > getMilestoneRes[0].milestones.length) {
      await reply(
        `❌ Give correct serial number within the range\nTo know the sno: ${prefix}rank`
      );
      return;
    }

    const milestones = getMilestoneRes[0].milestones.filter(
      (milestone, index) => index + 1 !== sno
    );

    const setMilestoneRes = await setMilestones(memberjid, milestones);
    if (setMilestoneRes) await reply(`✔ Milestone removed!`);
    else await reply(`❌ There is some problem!`);
  } else {
    await reply(`❌ There are 0 custom milestones for ${contact}`);
  }
};

const milestoneremove = () => {
  const cmd = ["milestoneremove", "removemilestone", "mr", "rm"];

  return { cmd, handler };
};

export default milestoneremove;
