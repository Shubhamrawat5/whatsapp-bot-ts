import { GroupMetadata } from "@adiwajshing/baileys";
import { Pvxgroups } from "../constants/constants";
import { Bot } from "../interface/Bot";

const { getCountTop } = require("../db/countMemberDB");
const { getDonation } = require("../db/donationDB");

export const addDefaultMilestones = async (bot: Bot, pvxgroups: Pvxgroups) => {
  const { pvxsubadmin, pvxadmin } = pvxgroups;

  //TODO: CHECK _ and key
  interface Milestones {
    [key: string]: string[];
  }
  interface Chats {
    [key: string]: GroupMetadata;
  }
  interface ResultCountGroupTop {
    memberjid: string;
  }
  interface donationRes {
    number: number;
    amount: number;
  }
  const milestones: Milestones = {};

  console.log("Adding default milestones");

  let chats: Chats = await bot.groupFetchAllParticipating();

  chats[pvxsubadmin].participants.forEach((member) => {
    milestones[member.id] = ["Sub-Admin of PVX"];
  });
  chats[pvxadmin].participants.forEach((member) => {
    milestones[member.id] = ["Main Admin of PVX"];
  });

  const resultCountGroupTop: ResultCountGroupTop[] = await getCountTop(100);
  resultCountGroupTop.forEach((member, index) => {
    let memberjid = member.memberjid;
    let number = index + 1;
    if (number > 50) {
      if (milestones[memberjid])
        milestones[memberjid].push("Top 100 active member of PVX");
      else milestones[memberjid] = ["Top 100 active member of PVX"];
    } else if (number > 10) {
      if (milestones[memberjid])
        milestones[memberjid].push("Top 50 active member of PVX");
      else milestones[memberjid] = ["Top 50 active member of PVX"];
    } else if (number > 1) {
      if (milestones[memberjid])
        milestones[memberjid].push("Top 10 active member of PVX");
      else milestones[memberjid] = ["Top 10 active member of PVX"];
    } else {
      if (milestones[memberjid])
        milestones[memberjid].push("Most active member of PVX");
      else milestones[memberjid] = ["Most active member of PVX"];
    }
  });

  const donationRes: donationRes[] = await getDonation();
  donationRes.forEach((member, index) => {
    let memberjid = `${member.number}@s.whatsapp.net`;
    if (index === 0) {
      if (milestones[memberjid])
        milestones[memberjid].push("Highest contribution in PVX funds");
      else milestones[memberjid] = ["Highest contribution in PVX funds"];
    } else if (member.amount >= 1000) {
      if (milestones[memberjid])
        milestones[memberjid].push("Huge Contribution in PVX funds");
      else milestones[memberjid] = ["Huge Contribution in PVX funds"];
    } else {
      if (milestones[memberjid])
        milestones[memberjid].push("Contribution in PVX funds");
      else milestones[memberjid] = ["Contribution in PVX funds"];
    }
  });

  console.log("Added default milestones");
  return milestones;
};
