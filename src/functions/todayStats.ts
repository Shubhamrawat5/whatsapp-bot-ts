import {
  getCountGroupsToday,
  getCountTopToday,
} from "../db/countMemberTodayDB";
import { Bot } from "../interfaces/Bot";
import { loggerBot } from "../utils/logger";

const todayStats = async (bot: Bot): Promise<string> => {
  try {
    const noOfResult = 5;
    const getCountTopRes = await getCountTopToday(noOfResult);
    let countGroupMsgTop = `*📛 TOP MEMBERS STATS 📛*`;

    getCountTopRes.forEach((member, index) => {
      countGroupMsgTop += `\n${index + 1}) ${member.name} - ${
        member.message_count
      }`;
    });

    const getCountGroupsRes = await getCountGroupsToday(noOfResult);
    let countGroupMsg = `*📛 TOP GROUP STATS 📛*`;

    getCountGroupsRes.forEach((group) => {
      let grpName = group.gname ?? "Not Found";
      if (grpName.toUpperCase().includes("<{PVX}>")) {
        // grpName = grpName.split(" ")[1];
        grpName = grpName.replace("<{PVX}> ", "");
        countGroupMsg += `\n${group.message_count} - ${grpName}`;
      }
    });

    const message = `📛 PVX TODAY"S STATS 📛\n\n${countGroupMsgTop}\n\n${countGroupMsg}`;
    return message;
  } catch (err) {
    await loggerBot(bot, "todayStats", err, undefined);
    console.log(err);
    return `_❌ There is some problem_`;
  }
};

export default todayStats;
