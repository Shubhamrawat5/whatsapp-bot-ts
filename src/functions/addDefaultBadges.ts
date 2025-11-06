import { pvxgroups } from "../utils/constants";
import { Bot } from "../interfaces/Bot";
import { getCountTop } from "../db/countMemberDB";
import { getDonation } from "../db/membersDB";
import { Chats } from "../interfaces/Chats";
import { getGroupData } from "../db/pvxGroupDB";

// {"12345678@s.whatsapp.net": [""Sub-Admin of PVX", "Top 10 active member of PVX"]}
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
    const { memberlid } = member;
    const number = index + 1;
    defaultBadges[memberlid] = defaultBadges[memberlid] || [];

    if (number > 50) {
      defaultBadges[memberlid].push("Top 100 active member of PVX");
    } else if (number > 10) {
      defaultBadges[memberlid].push("Top 50 active member of PVX");
    } else if (number > 1) {
      defaultBadges[memberlid].push("Top 10 active member of PVX");
    } else {
      defaultBadges[memberlid].push("Most active member of PVX");
    }
  });

  const getDonationRes = await getDonation();
  getDonationRes.forEach((member, index) => {
    const { memberlid } = member;
    defaultBadges[memberlid] = defaultBadges[memberlid] || [];

    if (index === 0) {
      defaultBadges[memberlid].push("Highest contribution in PVX funds");
    } else if (member.donation >= 1000) {
      defaultBadges[memberlid].push("Huge Contribution in PVX funds");
    } else {
      defaultBadges[memberlid].push("Contribution in PVX funds");
    }
  });

  const getGroupRes = await getGroupData();
  getGroupRes.forEach((group) => {
    group.expert?.forEach((expert) => {
      defaultBadges[expert] = defaultBadges[expert] || [];
      defaultBadges[expert].push(
        `Expert of ${group.gname.replace("<{PVX}> ", "")}`
      );
    });
  });

  console.log("Added default badges");
  return defaultBadges;
};
