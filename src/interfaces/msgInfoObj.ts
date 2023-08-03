import { GroupParticipant } from "@whiskeysockets/baileys";
import { MilestonesDefault } from "../functions/addDefaultMilestone";

export interface MsgInfoObj {
  from: string;
  command: string;
  args: string[];
  milestonesDefault: MilestonesDefault;
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
