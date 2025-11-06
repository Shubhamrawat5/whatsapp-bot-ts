import { GroupParticipant } from "@whiskeysockets/baileys";

const getGroupAdmins = (
  participants: GroupParticipant[] | undefined
): string[] => {
  if (!participants) return [];
  const admins: string[] = [];

  participants.forEach((member) => {
    if (member.admin) admins.push(member.id);
  });

  return admins; // returns array of admin Lids
};

export default getGroupAdmins;
