import { GroupParticipant } from "@adiwajshing/baileys";

export interface MsgInfoObj {
  from: string;
  command: string;
  args: string[];
  milestones: { [key: string]: string[] };
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
