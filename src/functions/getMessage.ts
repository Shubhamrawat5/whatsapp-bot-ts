import { WAMessage } from "@whiskeysockets/baileys";
import { prefix } from "../utils/constants";

const checkTaggedMessage = async (msg: WAMessage) => {
  if (
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation
  ) {
    // simple tagged text message
    return msg.message.extendedTextMessage.contextInfo.quotedMessage
      .conversation;
  }
  // tagged message has url, member mentioned
  return msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    ?.extendedTextMessage?.text;
};

const checkNonTaggedMessage = async (msg: WAMessage) => {
  if (msg.message?.extendedTextMessage?.text) {
    // message has url, member mentioned
    return msg.message.extendedTextMessage.text;
  }
  // simple text message
  return msg.message?.conversation;
};

const getMessage = async (msg: WAMessage, command: string) => {
  let message: string | undefined | null = "";
  try {
    if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      message = await checkTaggedMessage(msg);
    } else {
      message = await checkNonTaggedMessage(msg);
      message = message
        ? message.replace(prefix, "").replace(command, "").trim()
        : message;
    }
  } catch (err) {
    console.log(err);
  }

  return message;
};

export default getMessage;
