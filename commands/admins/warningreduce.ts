import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const {
  reduceCountWarning,
  getCountWarning,
  clearCountWarning,
} = require("../../db/warningDB");

export const command = () => {
  let cmd = ["warnreduce", "reducewarn", "warningreduce", "reducewarning"];

  return { cmd, handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  let { reply, from } = msgInfoObj;

  if (!msg.message?.extendedTextMessage) {
    await reply("❌ Tag someone!");
    return;
  }
  let mentioned = msg.message.extendedTextMessage.contextInfo?.mentionedJid;
  if (mentioned && mentioned.length) {
    //when member are mentioned with command
    if (mentioned.length === 1) {
      let warnCount = await getCountWarning(mentioned[0], from);
      let num_split = mentioned[0].split("@s.whatsapp.net")[0];

      if (warnCount < 1) {
        let warnMsg = `@${num_split} ,Your warning is already 0`;
        await bot.sendMessage(from, {
          text: warnMsg,
          mentions: mentioned,
        });
        return;
      }
      if (warnCount === 1) await clearCountWarning(mentioned[0], from);
      else await reduceCountWarning(mentioned[0], from);

      let warnMsg = `@${num_split} ,Your warning have been reduced by 1. Warning status: (${
        warnCount - 1
      }/3)`;

      await bot.sendMessage(from, {
        text: warnMsg,
        mentions: mentioned,
      });
    } else {
      //if multiple members are tagged
      await reply("❌ Mention only 1 member!");
    }
  } else {
    //when message is tagged with command
    const participant =
      msg.message.extendedTextMessage.contextInfo?.participant;
    if (!participant) return;
    let taggedMessageUser = [participant];

    let num_split = participant && participant.split("@s.whatsapp.net")[0];
    let warnCount = await getCountWarning(taggedMessageUser[0], from);

    if (warnCount < 1) {
      let warnMsg = `@${num_split} ,Your warning is already 0`;
      await bot.sendMessage(from, {
        text: warnMsg,
        mentions: taggedMessageUser,
      });
      return;
    }
    if (warnCount === 1) await clearCountWarning(taggedMessageUser[0], from);
    else await reduceCountWarning(taggedMessageUser[0], from);

    let warnMsg = `@${num_split} ,Your warning have been reduced by 1. Warning status: (${
      warnCount - 1
    }/3)`;

    await bot.sendMessage(from, {
      text: warnMsg,
      mentions: taggedMessageUser,
    });
  }
};
