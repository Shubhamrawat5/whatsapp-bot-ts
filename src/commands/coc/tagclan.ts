import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getPvxClanMembers } from "../../utils/coc/apis";
import { getAllMembersByTags } from "../../db/cocDb";
import getMessage from "../../functions/getMessage";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { groupMembers, command, from } = msgInfoObj;
  if (!groupMembers) return;

  const message = `CLAN MEMBERS: ${await getMessage(msg, command)}\n\n`;

  const clanMembers = await getPvxClanMembers();
  const membersJids = await getAllMembersByTags(clanMembers.map((i) => i.tag));

  await bot.sendMessage(
    from,
    { text: message, mentions: membersJids },
    { quoted: msg }
  );
};

const tagclan = () => {
  const cmd = ["tagclan", "coctagclan"];
  return { cmd, handler };
};

export default tagclan;
