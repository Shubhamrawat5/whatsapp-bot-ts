import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getVotingData, setVotingData } from "../../db/votingDB";
import { PREFIX } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, sender, args, from } = msgInfoObj;
  if (args.length === 0) {
    await reply(
      `❌ Give some values seperated with # to vote on like ${PREFIX}startvote #title #name1 #name2 #name3`
    );
    return;
  }
  const getVotingDataRes = await getVotingData(from);

  if (getVotingDataRes.length && getVotingDataRes[0].is_started) {
    await reply(
      `❌ Voting already going on, Stop by ${PREFIX}stopvote command`
    );
    return;
  }

  const body = msg.message?.conversation;
  if (!body) {
    await reply(
      `❌ Give some values seperated with # to vote on like ${PREFIX}startvote #title #name1 #name2 #name3`
    );
    return;
  }

  // let voteChoices = body.trim().replace(/ +/, ",").split(/,/).slice(1);
  const voteList = body.trim().split("#");
  const voteTitle = voteList[1].trim();
  const voteChoices = voteList.slice(2);

  if (voteChoices.length < 2) {
    await reply("❌ Give more than 1 voting choices!");
    return;
  }

  const voteListCount = new Array(voteChoices.length).fill(0); // [0,0,0]
  const voteListMember = [];
  for (let i = 0; i < voteChoices.length; ++i) voteListMember.push([]);

  const setVotingDataRes = await setVotingData(
    from,
    true,
    sender,
    voteTitle,
    voteChoices,
    voteListCount,
    voteListMember,
    []
  );

  if (setVotingDataRes) {
    let voteMsg = `*Voting started!*\nsend "${PREFIX}vote number" to vote\n\n*🗣️ ${voteTitle}*`;

    voteChoices.forEach((name: string, index: number) => {
      voteMsg += `\n${index + 1} for [${name.trim()}]`;
    });

    voteMsg += `\n\n_send ${PREFIX}checkvote or ${PREFIX}cv to see current status and ${PREFIX}stopvote to stop voting and see the result._`;
    await reply(voteMsg);
  } else {
    await reply(`❌ There is some problem`);
  }
};

const startvote = () => {
  const cmd = ["startvote"];

  return { cmd, handler };
};

export default startvote;
