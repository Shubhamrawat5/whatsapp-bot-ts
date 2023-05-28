import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

import axios from "axios";

const getGender = async (name: string) => {
  try {
    const url = "https://api.genderize.io/?name=" + name;
    const { data } = await axios.get(url);
    const genderText = `${data.name} is ${data.gender} with ${data.probability} probability`;
    return genderText;
  } catch (err) {
    console.log(err);
    return (err as Error).stack;
  }
};

export const command = () => {
  return { cmd: ["gender"], handler: handler };
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { prefix, reply, args } = msgInfoObj;

  if (args.length === 0) {
    const message = `❌ Name is not given! \nSend ${prefix}gender firstname`;
    await reply(message);
    return;
  }
  const namePerson = args[0];
  if (namePerson.includes("@")) {
    const message = `❌ Don't tag! \nSend ${prefix}gender firstname`;
    await reply(message);
    return;
  }
  const text = await getGender(namePerson);
  await reply(text);
};
