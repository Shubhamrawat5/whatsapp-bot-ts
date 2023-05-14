import { GroupMetadata } from "@adiwajshing/baileys";
import { getGroupAdmins } from "./getGroupAdmins";

export const getGroupData = (
  groupMetadata: GroupMetadata,
  botNumberJid: string,
  sender: string
) => {
  const groupDesc = groupMetadata.desc ? groupMetadata.desc.toString() : "";
  const groupMembers = groupMetadata.participants;
  const groupAdmins = getGroupAdmins(groupMembers);
  const isBotGroupAdmins = groupAdmins?.includes(botNumberJid) || false;
  const isGroupAdmins = groupAdmins?.includes(sender) || false;

  return {
    groupDesc,
    groupMembers,
    groupAdmins,
    isBotGroupAdmins,
    isGroupAdmins,
  };
};
