import { WAMessage } from "@whiskeysockets/baileys";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import getMentionedOrTaggedParticipant from "../../functions/getParticipant";
import { getPlayerDetails } from "../../utils/coc/apis";
import { resolveTag } from "../../utils/coc/helpers";
import { getCocTags } from "../../db/cocDb";

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, sender } = msgInfoObj;

  let participant: string;

  if (msg.message?.extendedTextMessage) {
    participant = await getMentionedOrTaggedParticipant(msg);
  } else {
    participant = sender;
  }

  // Get all coc tags for the user
  const userTags = await getCocTags(participant);

  if (!userTags || userTags.length === 0) {
    await reply("❌ No COC tags found for this user!");
    return;
  }

  let response = "🎮 *COC Details*\n\n";

  // Fetch details for each tag using Promise.all and map
  const details = await Promise.all(
    userTags.map(async (tag) => {
      const resolvedTag = resolveTag(tag);
      const playerDetails = await getPlayerDetails(resolvedTag);

      return playerDetails
        ? `*Tag:* ${resolvedTag}\n*Name:* ${playerDetails.name}\n*TH:* ${
            playerDetails.townHallLevel
          }\n*Trophies:* ${playerDetails.trophies}\n*Clan:* ${
            playerDetails.clan?.name || "No Clan"
          }\n\n`
        : `❌ Could not fetch details for tag: ${resolvedTag}\n\n`;
    })
  );

  response += details.join("");

  await reply(response.trim());
};

const cocdetails = () => {
  const cmd = ["cocdetails"];
  return { cmd, handler };
};

export default cocdetails;
