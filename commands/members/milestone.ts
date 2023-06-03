import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getMilestoneText } from "../../db/milestoneDB";

export const milestone = () => {
  const cmd = ["milestone", "milestones"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply } = msgInfoObj;

  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  let message = `*─「 <{PVX}> MILESTONES 」 ─*

Send ${prefix}rank to know your rank with milestones.${readMore}

 *[DEFAULT MILESTONES]*
⭐ Main Admin of PVX
⭐ Sub-Admin of PVX
⭐ Most active member of PVX
⭐ Top 10 active member of PVX
⭐ Top 50 active member of PVX
⭐ Top 100 active member of PVX
⭐ Highest contribution in PVX funds
⭐ Huge Contribution in PVX funds
⭐ Contribution in PVX funds`;

  const getMilestoneTextRes = await getMilestoneText();
  if (getMilestoneTextRes.length) {
    message += `\n\n *[CUSTOM MILESTONES]*\nAdmin can give following milestones by ${prefix}milestoneadd #contact #sno\nEg: ${prefix}milestoneadd #919876.... #2`;
    getMilestoneTextRes.forEach((milestone, index) => {
      message += `\n⭐ ${index + 1}. ${milestone.milestone}`;
    });
  }

  await reply(message);
};
