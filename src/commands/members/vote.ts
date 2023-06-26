import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { getVotingData, setVotingData } from "../../db/VotingDB";
import { prefix } from "../../constants/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, sender, senderName, args, from } = msgInfoObj;

  const getVotingDataRes = await getVotingData(from);

  if (getVotingDataRes.length === 0 || !getVotingDataRes[0].is_started) {
    await reply(
      `❌ Voting is not started here, Start by \n${prefix}startvote #title #name1 #name2 #name3`
    );
    return;
  }

  const votingResult = getVotingDataRes[0];

  if (votingResult.votedMembers.includes(sender)) {
    await reply("❌ You already voted.");
    return;
  }
  if (args.length === 0) {
    await reply("❌ Give value to vote on!");
    return;
  }

  const voteNumber = Math.floor(Number(args[0]));
  if (Number.isNaN(voteNumber)) {
    await reply("❌ Give a number!");
    return;
  }

  if (voteNumber > votingResult.count.length || voteNumber < 1) {
    await reply("❌ Number out of range!");
    return;
  }

  votingResult.count[voteNumber - 1] += 1; // increase vote
  votingResult.membersVotedFor[voteNumber - 1].push(senderName); // save who voted
  votingResult.votedMembers.push(sender); // member voted

  const setVotingDataRes = await setVotingData(
    from,
    true,
    votingResult.started_by,
    votingResult.title,
    votingResult.choices,
    votingResult.count,
    votingResult.membersVotedFor,
    votingResult.votedMembers
  );

  if (setVotingDataRes) {
    await reply(
      `_✔ Voted for [${votingResult.choices[voteNumber - 1].trim()}]_`
    );
  } else {
    await reply(`❌ There is some problem`);
  }
};

const vote = () => {
  const cmd = ["vote"];

  return { cmd, handler };
};

export default vote;
