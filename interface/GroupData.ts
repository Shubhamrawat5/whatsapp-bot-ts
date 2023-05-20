import { GroupParticipant } from "@adiwajshing/baileys";

export interface GroupData {
  groupDesc: string;
  groupMembers: GroupParticipant[];
  groupAdmins: string[];
  isBotGroupAdmins: boolean;
  isGroupAdmins: boolean;
}
