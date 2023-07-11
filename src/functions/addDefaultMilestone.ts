import { GroupMetadata } from "@whiskeysockets/baileys";
import { pvxgroups } from "../constants/constants";
import { Bot } from "../interface/Bot";
import { getCountTop } from "../db/countMemberDB";
import { getDonation } from "../db/membersDB";

export interface Milestones {
  [key: string]: string[];
}
export interface Chats {
  [key: string]: GroupMetadata;
}

export const addDefaultMilestones = async (bot: Bot) => {
  const { pvxsubadmin, pvxadmin } = pvxgroups;

  const milestones: Milestones = {};

  console.log("Adding default milestones");

  const chats: Chats = await bot.groupFetchAllParticipating();

  chats[pvxsubadmin].participants.forEach((member) => {
    milestones[member.id] = ["Sub-Admin of PVX"];
  });
  chats[pvxadmin].participants.forEach((member) => {
    milestones[member.id] = ["Main Admin of PVX"];
  });

  const getCountTopRes = await getCountTop(100);
  getCountTopRes.forEach((member, index) => {
    const { memberjid } = member;
    const number = index + 1;
    milestones[memberjid] = milestones[memberjid] || [];

    if (number > 50) {
      milestones[memberjid].push("Top 100 active member of PVX");
    } else if (number > 10) {
      milestones[memberjid].push("Top 50 active member of PVX");
    } else if (number > 1) {
      milestones[memberjid].push("Top 10 active member of PVX");
    } else {
      milestones[memberjid].push("Most active member of PVX");
    }
  });

  const getDonationRes = await getDonation();
  getDonationRes.forEach((member, index) => {
    const { memberjid } = member;
    milestones[memberjid] = milestones[memberjid] || [];

    if (index === 0) {
      milestones[memberjid].push("Highest contribution in PVX funds");
    } else if (member.donation >= 1000) {
      milestones[memberjid].push("Huge Contribution in PVX funds");
    } else {
      milestones[memberjid].push("Contribution in PVX funds");
    }
  });

  console.log("Added default milestones");
  return milestones;
};
