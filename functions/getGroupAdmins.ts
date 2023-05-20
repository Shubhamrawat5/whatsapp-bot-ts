import { GroupParticipant } from "@adiwajshing/baileys";

export const getGroupAdmins = (
  participants: GroupParticipant[] | undefined
): string[] => {
  if (!participants) return [];
  const admins = [];
  for (let memb of participants) {
    memb.admin ? admins.push(memb.id) : "";
  }
  return admins;
};
