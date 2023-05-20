import { GroupParticipant } from "@adiwajshing/baileys";

export interface MsgInfoObj {
  from: string;
  prefix: string;
  sender: string;
  senderName: string | undefined | null;
  groupName: string;
  groupDesc: string;
  isBotGroupAdmins: boolean;
  isGroupAdmins: boolean;
  isMedia: boolean;
  type: string;
  isTaggedImage: boolean;
  isTaggedDocument: boolean;
  isTaggedVideo: boolean;
  isTaggedSticker: boolean;
  myNumber: string | undefined;
  botNumberJid: string;
  command: string;
  args: string[];
  groupMembers: GroupParticipant[];
  groupAdmins: string[];
  reply: any;
  milestones: any;
  allCommandsName: string[];
}
