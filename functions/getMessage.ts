const checkTaggedMessage = async (msg: any) => {
  if (
    msg.message.extendedTextMessage?.contextInfo?.quotedMessage?.conversation
  ) {
    // simple tagged text message
    return msg.message.extendedTextMessage.contextInfo.quotedMessage
      .conversation;
  } else {
    // tagged message has url, member mentioned
    return msg.message.extendedTextMessage.contextInfo.quotedMessage
      .extendedTextMessage.text;
  }
};

const checkNonTaggedMessage = async (msg: any) => {
  if (msg.message.extendedTextMessage?.text) {
    // message has url, member mentioned
    return msg.message.extendedTextMessage.text;
  } else {
    // simple text message
    return msg.message.conversation;
  }
};

export const getMessage = async (msg: any, prefix: string, command: string) => {
  let message = "";
  try {
    if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage) {
      message = await checkTaggedMessage(msg);
    } else {
      message = await checkNonTaggedMessage(msg);
      message = message.replace(prefix, "").replace(command, "").trim();
    }
  } catch (err) {
    console.log(err);
  }

  return message;
};
