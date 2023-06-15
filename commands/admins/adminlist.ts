import { WAMessage, GroupParticipant } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import { pvxgroups } from "../../constants/constants";
import { getUsernames } from "../../db/countMemberDB";

export const adminlist = () => {
  const cmd = ["adminlist"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
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
  for (const group of groups) {
    group.participants.forEach(async (mem: GroupParticipant) => {
      if (mem.admin && !memberjidAllArray.includes(mem.id)) {
        memberjidAllArray.push(mem.id);
      }
    });
  }

  // get all jids name from DB
  const getUsernamesRes = await getUsernames(memberjidAllArray);

  if (getUsernamesRes.length != memberjidAllArray.length) {
    await reply("Some names are not found in DB.");
  }

  interface MemberjidToUsername {
    [key: string]: string;
  }

  // create object of { jid: name }
  const memberjidObj: MemberjidToUsername = {};
  getUsernamesRes.forEach((mem) => {
    memberjidObj[mem.memberjid] = mem.name;
  });

  // create the message
  let pvxMsg = `*📛 PVX ADMIN LIST 📛*\nTotal: ${memberjidAllArray.length}${readMore}`;

  const subAdminPanel: string[] = [];
  // get all admins from sub admin panel
  chats[pvxgroups.pvxsubadmin].participants.forEach((mem: GroupParticipant) => {
    subAdminPanel.push(mem.id);
  });

  const notInSubPanel: MemberjidToUsername = {};
  let notInSubPanelMsg = "\n\n[NOT IN SUB ADMIN PANEL]";

  let tempMsg = "";
  for (const group of groups) {
    let grpName = group.subject;
    grpName = grpName.replace("<{PVX}> ", "");
    tempMsg += `\n\n*[${grpName}]*`;
    let count = 1;
    group.participants.forEach(async (mem: GroupParticipant) => {
      if (mem.admin) {
        const { id } = mem;
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
  }

  if (Object.keys(notInSubPanel).length) {
    pvxMsg += notInSubPanelMsg;
  }
  pvxMsg += tempMsg;

  await reply(pvxMsg);
};
