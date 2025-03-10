import {
  getCountGroupsToday,
  getCountTopToday,
  getCountUniqueMemberToday,
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

    const getCountGroupsRes = await getCountGroupsToday();
    let countGroupMsg = `*📛 TOP GROUPS STATS 📛*`;
    let messageCount = 0;
    getCountGroupsRes.forEach((group, index) => {
      messageCount += Number(group.message_count);
      if (index < 5) {
        let grpName = group.gname ?? "Not Found";
        if (grpName.toUpperCase().includes("<{PVX}>")) {
          // grpName = grpName.split(" ")[1];
          grpName = grpName.replace("<{PVX}> ", "");
          countGroupMsg += `\n${index + 1}) ${grpName} - ${
            group.message_count
          }`;
        }
      }
    });

    const getCountUniqueMemberRes = await getCountUniqueMemberToday();
    let memberCount = 0;
    let groupCount = 0;
    if (getCountUniqueMemberRes.length !== 0) {
      memberCount = getCountUniqueMemberRes[0].member_count;
      groupCount = getCountUniqueMemberRes[0].group_count;
    }

    const message = `📛 PVX TODAY'S STATS 📛\nTotal messages: ${messageCount}\nActive Groups: ${groupCount}\nActive members: ${memberCount}\n\n${countGroupMsgTop}\n\n${countGroupMsg}`;
    return message;
  } catch (err) {
    await loggerBot(bot, "todayStats", err, undefined);
    console.log(err);
    return `_❌ There is some problem_`;
  }
};

export default todayStats;
