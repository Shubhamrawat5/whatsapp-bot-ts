import { GroupParticipant } from "@whiskeysockets/baileys";

const getGroupAdmins = (
  participants: GroupParticipant[] | undefined
): string[] => {
  if (!participants) return [];
  const admins: string[] = [];

  participants.forEach((member) => {
    if (member.admin) admins.push(member.id);
  });

  return admins;
};

export default getGroupAdmins;
