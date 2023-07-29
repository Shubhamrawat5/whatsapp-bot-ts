import { GroupMetadata, GroupParticipant } from "@whiskeysockets/baileys";
import getGroupAdmins from "./getGroupAdmins";
import { GroupData } from "../interfaces/GroupData";

const getGroupData = (
  groupMetadata: GroupMetadata,
  botNumberJid: string,
  sender: string
): GroupData => {
  const groupDesc: string = groupMetadata.desc
    ? groupMetadata.desc.toString()
    : "";
  const groupMembers: GroupParticipant[] = groupMetadata.participants;
  const groupAdmins: string[] = getGroupAdmins(groupMembers);
  const isBotGroupAdmins: boolean =
    groupAdmins?.includes(botNumberJid) || false;
  const isGroupAdmins: boolean = groupAdmins?.includes(sender) || false;

  const groupData: GroupData = {
    groupDesc,
    groupMembers,
    groupAdmins,
    isBotGroupAdmins,
    isGroupAdmins,
  };

  return groupData;
};

export default getGroupData;
