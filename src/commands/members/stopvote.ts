import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getVotingData, stopVotingData } from "../../db/VotingDB";
import { prefix } from "../../constants/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, isGroupAdmins, sender, from } = msgInfoObj;
  const getVotingDataRes = await getVotingData(from);

  if (getVotingDataRes.length === 0 || !getVotingDataRes[0].is_started) {
    await reply(
      `❌ Voting is not started here, Start by \n${prefix}startvote #title #name1 #name2 #name3`
    );
    return;
  }

  const votingResult = getVotingDataRes[0];

  let resultVoteMsg = "";
  if (votingResult.started_by === sender || isGroupAdmins) {
    const stopVotingDataRes = await stopVotingData(from);
    if (stopVotingDataRes) {
      resultVoteMsg += `*Voting Result:*\n🗣️ ${votingResult.title}`;
    } else {
      await reply(`_❌ There is some problem`);
      return;
    }
  } else {
    await reply(
      "❌ Only admin or that member who started the voting, can stop current voting!"
    );
    return;
  }

  const totalVoted = votingResult.votedMembers.length;

  votingResult.choices.forEach((name: string, index: number) => {
    resultVoteMsg += `\n======= ${(
      (votingResult.count[index] / totalVoted) *
      100
    ).toFixed()}% =======\n📛 *[${name.trim()}] : ${
      votingResult.count[index]
    }*\n`;

    // add voted members username
    votingResult.membersVotedFor[index].forEach((mem: string) => {
      resultVoteMsg += `_${mem},_ `;
    });
  });
  await reply(resultVoteMsg);
};

const stopvote = () => {
  const cmd = ["stopvote"];

  return { cmd, handler };
};

export default stopvote;
