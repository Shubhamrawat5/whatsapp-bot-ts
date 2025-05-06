import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getExpertNames } from "../../db/pvxGroupDB";
import { prefix } from "../../utils/constants";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { from, reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  const getExpertRes = await getExpertNames(from);
  let countGroupMsg = `*📛 GROUP EXPERTS 📛*${readMore}\n`;

  if (getExpertRes.length > 0) {
    getExpertRes.forEach((expert, index) => {
      countGroupMsg += `\n${index + 1}) ${expert.name}`;
    });

    await reply(countGroupMsg);
  } else {
    await reply(`No Expert in this group! Add by ${prefix}expertadd`);
  }
};

const expert = () => {
  const cmd = ["expert", "experts"];

  return { cmd, handler };
};

export default expert;
