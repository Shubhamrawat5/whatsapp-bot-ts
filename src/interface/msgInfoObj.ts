import { GroupParticipant } from "@whiskeysockets/baileys";
import { Milestones } from "../functions/addDefaultMilestone";

export interface MsgInfoObj {
  from: string;
  command: string;
  args: string[];
  milestones: Milestones;
  allCommandsName: string[];

  reply: (text: string | undefined) => Promise<boolean>;

  sender: string;
  senderName: string;
  botNumberJid: string;

  groupName: string | undefined;
  groupDesc: string | undefined;
  isBotGroupAdmins: boolean;
  isGroupAdmins: boolean;
  groupMembers: GroupParticipant[] | undefined;
  groupAdmins: string[];
}
