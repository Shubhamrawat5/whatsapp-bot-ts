import { GroupParticipant } from "@whiskeysockets/baileys";

export interface GroupData {
  groupDesc: string;
  groupMembers: GroupParticipant[];
  groupAdmins: string[];
  isBotGroupAdmins: boolean;
  isGroupAdmins: boolean;
}
