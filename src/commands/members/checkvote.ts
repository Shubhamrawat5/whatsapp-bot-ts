import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getVotingData } from "../../db/votingDB";
import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, from } = msgInfoObj;
  const getVotingDataRes = await getVotingData(from);

  if (getVotingDataRes.length === 0 || !getVotingDataRes[0].is_started) {
    await reply(
      `❌ Voting is not started here, Start by \n${prefix}startvote #title #name1 #name2 #name3`
    );
    return;
  }

  const votingResult = getVotingDataRes[0];

  let resultVoteMsg = "";

  resultVoteMsg += `send "${prefix}vote number" to vote\n\n*🗣️ ${votingResult.title}*`;
  votingResult.choices.forEach((name: string, index: number) => {
    resultVoteMsg += `\n${index + 1} for [${name.trim()}]`;
  });
  resultVoteMsg += `\n\n*Voting Current Status:*`;

  const totalVoted = votingResult.voted_members.length;

  votingResult.choices.forEach((name: string, index: number) => {
    resultVoteMsg += `\n======= ${(
      (votingResult.count[index] / totalVoted) *
      100
    ).toFixed()}% =======\n📛 *[${name.trim()}] : ${
      votingResult.count[index]
    }*\n`;

    // add voted members username
    votingResult.members_voted_for[index].forEach((member) => {
      resultVoteMsg += `_${member},_ `;
    });
  });
  await reply(resultVoteMsg);
};

const checkvote = () => {
  const cmd = ["checkvote", "cv"];

  return { cmd, handler };
};

export default checkvote;
