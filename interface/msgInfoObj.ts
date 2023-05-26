import { GroupParticipant } from "@adiwajshing/baileys";

export interface MsgInfoObj {
  from: string;
  prefix: string;
  isMedia: boolean;
  type: string;
  command: string;
  args: string[];
  milestones: { [key: string]: string[] };
  allCommandsName: string[];

  reply: (text: string | undefined) => Promise<boolean>;

  isTaggedImage: boolean;
  isTaggedDocument: boolean;
  isTaggedVideo: boolean;
  isTaggedSticker: boolean;

  sender: string;
  senderName: string;
  myNumber: string | undefined;
  botNumberJid: string;

  groupName: string | undefined;
  groupDesc: string | undefined;
  isBotGroupAdmins: boolean;
  isGroupAdmins: boolean;
  groupMembers: GroupParticipant[] | undefined;
  groupAdmins: string[];
}
