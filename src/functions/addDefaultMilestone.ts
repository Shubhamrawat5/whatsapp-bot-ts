import { pvxgroups } from "../utils/constants";
import { Bot } from "../interfaces/Bot";
import { getCountTop } from "../db/countMemberDB";
import { getDonation } from "../db/membersDB";
import { Chats } from "../interfaces/Chats";

export interface MilestonesDefault {
  [key: string]: string[];
}

export const addDefaultMilestones = async (bot: Bot) => {
  const { pvxsubadmin, pvxadmin } = pvxgroups;

  const milestonesDefault: MilestonesDefault = {};

  console.log("Adding default milestones");

  const chats: Chats = await bot.groupFetchAllParticipating();

  chats[pvxsubadmin]?.participants.forEach((member) => {
    milestonesDefault[member.id] = ["Sub-Admin of PVX"];
  });
  chats[pvxadmin]?.participants.forEach((member) => {
    milestonesDefault[member.id] = ["Main Admin of PVX"];
  });

  const getCountTopRes = await getCountTop(100);
  getCountTopRes.forEach((member, index) => {
    const { memberjid } = member;
    const number = index + 1;
    milestonesDefault[memberjid] = milestonesDefault[memberjid] || [];

    if (number > 50) {
      milestonesDefault[memberjid].push("Top 100 active member of PVX");
    } else if (number > 10) {
      milestonesDefault[memberjid].push("Top 50 active member of PVX");
    } else if (number > 1) {
      milestonesDefault[memberjid].push("Top 10 active member of PVX");
    } else {
      milestonesDefault[memberjid].push("Most active member of PVX");
    }
  });

  const getDonationRes = await getDonation();
  getDonationRes.forEach((member, index) => {
    const { memberjid } = member;
    milestonesDefault[memberjid] = milestonesDefault[memberjid] || [];

    if (index === 0) {
      milestonesDefault[memberjid].push("Highest contribution in PVX funds");
    } else if (member.donation >= 1000) {
      milestonesDefault[memberjid].push("Huge Contribution in PVX funds");
    } else {
      milestonesDefault[memberjid].push("Contribution in PVX funds");
    }
  });

  console.log("Added default milestones");
  return milestonesDefault;
};
