import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getExpert } from "../../db/pvxGroupDB";
import { PREFIX } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from, reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  const jids: string[] = [];
  const getExpertRes = await getExpert(from);
  let countGroupMsg = `*📛 GROUP EXPERTS 📛*${readMore}\n`;

  if (getExpertRes.length > 0 && getExpertRes[0].expert.length > 0) {
    getExpertRes[0].expert.forEach((expert, index) => {
      countGroupMsg += `\n${index + 1}) @${expert.split("@")[0]}`;
      jids.push(expert);
    });
    await bot.sendMessage(
      from,
      { text: countGroupMsg, mentions: jids },
      { quoted: msg }
    );
  } else {
    await reply(`No Expert in this group! Add by ${PREFIX}expertadd`);
  }
};

const tagexpert = () => {
  const cmd = ["tagexpert", "tagexperts"];

  return { cmd, handler };
};

export default tagexpert;
