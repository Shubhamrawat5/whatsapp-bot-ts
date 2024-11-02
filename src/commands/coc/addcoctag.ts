import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { getCoctag, setCoctag } from "../../db/membersDB";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";
import { isValidTag, resolveTag } from "../../utils/coc/helpers";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;

  // Check if tag is provided
  if (!args[0]) {
    await reply("❌ Please provide a tag!");
    return;
  }

  const tag = resolveTag(args[0]);

  if (!isValidTag(tag)) {
    await reply("❌ Invalid tag!");
    return;
  }

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag someone!");
    return;
  }

  const participant = await getMentionedOrTaggedParticipant(msg);
  if (!participant) {
    await reply("❌ Tag someone!");
    return;
  }

  const newTag = args[0].toLowerCase();

  const existingCoctags = await getCoctag(participant);

  if (!existingCoctags.includes(newTag)) {
    existingCoctags.push(newTag);

    const success = await setCoctag(participant, existingCoctags);
    if (success) {
      await reply(`✔ Tag "${newTag}" added successfully!`);
    } else {
      await reply(`❌ Failed to add tag "${newTag}"!`);
    }
  } else {
    await reply(`❌ User already has the tag "${newTag}"!`);
  }
};

const addcoctag = () => {
  const cmd = ["addcoctag", "tag"];
  return { cmd, handler };
};

export default addcoctag;
