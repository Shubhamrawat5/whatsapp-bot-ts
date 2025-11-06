import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCountWarning } from "../../db/warningDB";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { sender, from } = msgInfoObj;

  let participant: string;

  // if (args.length) {
  //   participant = `${args.join("").replace(/ |-|\(|\)/g, "")}@s.whatsapp.net`;
  // } else
  if (msg.message?.extendedTextMessage) {
    participant = await getMentionedOrTaggedParticipant(msg);
  } else {
    participant = sender;
  }

  const getCountWarningRes = await getCountWarning(participant, from);
  const warnCount = getCountWarningRes.length
    ? getCountWarningRes[0].warning_count
    : 0;
  const lidSplit = participant.split("@lid")[0];
  const warnMsg = `@${lidSplit} ,Your warning count is ${warnCount} for this group!`;

  await bot.sendMessage(from, {
    text: warnMsg,
    mentions: [participant],
  });
};

const warncheck = () => {
  const cmd = ["warncheck", "warncount", "countwarn", "checkwarn"];

  return { cmd, handler };
};

export default warncheck;
