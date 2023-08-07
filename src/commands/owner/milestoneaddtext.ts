import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
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
  else await reply(`❌ There is some problem or Milestone is already there!`);
};

const milestoneaddtext = () => {
  const cmd = ["milestoneaddtext", "milestonetextadd", "mat", "mta"];

  return { cmd, handler };
};

export default milestoneaddtext;
