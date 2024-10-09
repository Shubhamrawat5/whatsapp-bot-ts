import { pvxgroups } from "../utils/constants";
import { Bot } from "../interfaces/Bot";
import { getCountTop } from "../db/countMemberDB";
import { getDonation } from "../db/membersDB";
import { Chats } from "../interfaces/Chats";

export interface DefaultBadge {
  [key: string]: string[];
}

export const addDefaultbadges = async (bot: Bot) => {
  const { pvxsubadmin, pvxadmin } = pvxgroups;

  const defaultBadges: DefaultBadge = {};

  console.log("Adding default badges");

  const chats: Chats = await bot.groupFetchAllParticipating();

  chats[pvxsubadmin]?.participants.forEach((member) => {
    defaultBadges[member.id] = ["Sub-Admin of PVX"];
  });
  chats[pvxadmin]?.participants.forEach((member) => {
    defaultBadges[member.id] = ["Main Admin of PVX"];
  });

  const getCountTopRes = await getCountTop(100);
  getCountTopRes.forEach((member, index) => {
    const { memberjid } = member;
    const number = index + 1;
    defaultBadges[memberjid] = defaultBadges[memberjid] || [];

    if (number > 50) {
      defaultBadges[memberjid].push("Top 100 active member of PVX");
    } else if (number > 10) {
      defaultBadges[memberjid].push("Top 50 active member of PVX");
    } else if (number > 1) {
      defaultBadges[memberjid].push("Top 10 active member of PVX");
    } else {
      defaultBadges[memberjid].push("Most active member of PVX");
    }
  });

  const getDonationRes = await getDonation();
  getDonationRes.forEach((member, index) => {
    const { memberjid } = member;
    defaultBadges[memberjid] = defaultBadges[memberjid] || [];

    if (index === 0) {
      defaultBadges[memberjid].push("Highest contribution in PVX funds");
    } else if (member.donation >= 1000) {
      defaultBadges[memberjid].push("Huge Contribution in PVX funds");
    } else {
      defaultBadges[memberjid].push("Contribution in PVX funds");
    }
  });

  console.log("Added default badges");
  return defaultBadges;
};
