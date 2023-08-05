import { WAMessage, GroupParticipant } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";

import { pvxgroups } from "../../utils/constants";
import { getUsernames } from "../../db/membersDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);

  // TODO: make common function to add readmore
  const readMore = more.repeat(4001);
  const chats = await bot.groupFetchAllParticipating();
  // console.log(chats);
  // !v.announce &&
  const groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>"))
    .map((v) => ({
      subject: v.subject,
      id: v.id,
      participants: v.participants,
    }));

  // get all jids of admin
  const memberjidAllArray: string[] = [];
  groups.forEach((group) => {
    group.participants.forEach(async (member: GroupParticipant) => {
      if (member.admin && !memberjidAllArray.includes(member.id)) {
        memberjidAllArray.push(member.id);
      }
    });
  });

  // get all jids name from DB
  const getUsernamesRes = await getUsernames(memberjidAllArray);

  if (getUsernamesRes.length !== memberjidAllArray.length) {
    await reply("Some names are not found in DB.");
  }

  interface MemberjidToUsername {
    [key: string]: string;
  }

  // create object of { jid: name }
  const memberjidObj: MemberjidToUsername = {};
  getUsernamesRes.forEach((member) => {
    memberjidObj[member.memberjid] = member.name;
  });

  // create the message
  let pvxMsg = `*📛 PVX ADMIN LIST 📛*\nTotal: ${memberjidAllArray.length}${readMore}`;

  const subAdminPanel: string[] = [];
  // get all admins from sub admin panel
  chats[pvxgroups.pvxsubadmin]?.participants.forEach(
    (member: GroupParticipant) => {
      subAdminPanel.push(member.id);
    }
  );

  const notInSubPanel: MemberjidToUsername = {};
  let notInSubPanelMsg = "\n\n[NOT IN SUB ADMIN PANEL]";

  let tempMsg = "";
  groups.forEach((group) => {
    let grpName = group.subject;
    grpName = grpName.replace("<{PVX}> ", "");
    tempMsg += `\n\n*[${grpName}]*`;
    let count = 1;
    group.participants.forEach(async (member: GroupParticipant) => {
      if (member.admin) {
        const { id } = member;
        const name = memberjidObj[id];
        // if name present
        // if (name) {
        //   tempMsg += `\n${count}) ${name}`;
        // } else {
        //   tempMsg += `\n${count}) ${id}`;
        // }

        tempMsg += `\n${count}) ${name}`;

        if (!subAdminPanel.includes(id) && !notInSubPanel[id]) {
          notInSubPanel[id] = name;
          notInSubPanelMsg += `\n- ${name}`;
        }
        count += 1;
      }
    });
  });

  if (Object.keys(notInSubPanel).length) {
    pvxMsg += notInSubPanelMsg;
  }
  pvxMsg += tempMsg;

  await reply(pvxMsg);
};

const adminlist = () => {
  const cmd = ["adminlist"];

  return { cmd, handler };
};

export default adminlist;
