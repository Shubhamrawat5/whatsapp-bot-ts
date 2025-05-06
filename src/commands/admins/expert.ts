import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getExpert } from "../../db/pvxGroupDB";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  const jids: string[] = [];
  const getExpertRes = await getExpert(from);
  let countGroupMsg = `*📛 GROUP EXPERTS 📛*${readMore}\n`;

  getExpertRes[0].expert.forEach((expert, index) => {
    countGroupMsg += `\n${index + 1}) @${expert.split("@")[0]}`;
    jids.push(expert);
  });

  await bot.sendMessage(
    from,
    { text: countGroupMsg, mentions: jids },
    { quoted: msg }
  );
};

const expert = () => {
  const cmd = ["expert", "experts"];

  return { cmd, handler };
};

export default expert;
