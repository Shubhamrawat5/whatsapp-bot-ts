import { GroupParticipant } from "@whiskeysockets/baileys";
import { DefaultBadge } from "../functions/addDefaultBadges";

export interface MsgInfoObj {
  from: string;
  command: string;
  args: string[];
  defaultBadges: DefaultBadge;
  allCommandsName: string[];

  reply: (text: string | undefined) => Promise<boolean>;

  sender: string;
  senderName: string;
  botNumberJid: string;

  groupName: string | undefined;
  groupDesc: string | undefined;
  isBotGroupAdmin: boolean;
  isSenderGroupAdmin: boolean;
  groupMembers: GroupParticipant[] | undefined;
  groupAdmins: string[];
}
