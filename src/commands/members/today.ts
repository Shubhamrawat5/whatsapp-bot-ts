import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import {
  getCountGroupsToday,
  getCountTopToday,
} from "../../db/countMemberTodayDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply } = msgInfoObj;

  const noOfResult = 5;
  const getCountTopRes = await getCountTopToday(noOfResult);
  let countGroupMsgTop = `*📛 TOP MEMBERS STATS 📛*\n`;

  getCountTopRes.forEach((member, index) => {
    countGroupMsgTop += `\n${index + 1}) ${member.name} - ${
      member.message_count
    }`;
  });

  const getCountGroupsRes = await getCountGroupsToday(noOfResult);
  let countGroupMsg = `*📛 TOP GROUP STATS 📛*\n`;

  getCountGroupsRes.forEach((group) => {
    let grpName = group.gname ?? "Not Found";
    if (grpName.toUpperCase().includes("<{PVX}>")) {
      // grpName = grpName.split(" ")[1];
      grpName = grpName.replace("<{PVX}> ", "");
      countGroupMsg += `\n${group.message_count} - ${grpName}`;
    }
  });

  const message = `📛 PVX TODAY"S STATS 📛\n\n${countGroupMsgTop}\n\n${countGroupMsg}`;
  await reply(message);
};

const today = () => {
  const cmd = ["today"];

  return { cmd, handler };
};

export default today;
