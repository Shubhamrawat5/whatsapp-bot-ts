import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getVotingData, stopVotingData } from "../../db/VotingDB";

export const command = () => {
  const cmd = ["stopvote"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply, isGroupAdmins, sender, from } = msgInfoObj;
  const res = await getVotingData(from);
  const votingResult = res[0];

  if (!votingResult.is_started) {
    await reply(
      `❌ Voting is not started here, Start by \n${prefix}startvote #title #name1 #name2 #name3`
    );
    return;
  }

  let resultVoteMsg = "";
  if (votingResult.started_by === sender || isGroupAdmins) {
    await stopVotingData(from);
    resultVoteMsg += `*Voting Result:*\n🗣️ ${votingResult.title}`;
  } else {
    await reply(
      "❌ Only admin or that member who started the voting, can stop current voting!"
    );
    return;
  }

  const totalVoted = votingResult.voted_members.length;

  votingResult.choices.forEach((name: string, index: number) => {
    resultVoteMsg += `\n======= ${(
      (votingResult.count[index] / totalVoted) *
      100
    ).toFixed()}% =======\n📛 *[${name.trim()}] : ${
      votingResult.count[index]
    }*\n`;

    //add voted members username
    votingResult.members_voted_for[index].forEach((mem: string) => {
      resultVoteMsg += `_${mem},_ `;
    });
  });
  await reply(resultVoteMsg);
};
