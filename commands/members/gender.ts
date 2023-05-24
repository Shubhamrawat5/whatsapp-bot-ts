import { WAMessage } from "@adiwajshing/baileys";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";

const axios = require("axios");

const getGender = async (name: string) => {
  try {
    let url = "https://api.genderize.io/?name=" + name;
    let { data } = await axios.get(url);
    let genderText = `${data.name} is ${data.gender} with ${data.probability} probability`;
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
  let { prefix, reply, args } = msgInfoObj;

  if (args.length === 0) {
    let message = `❌ Name is not given! \nSend ${prefix}gender firstname`;
    await reply(message);
    return;
  }
  let namePerson = args[0];
  if (namePerson.includes("@")) {
    let message = `❌ Don't tag! \nSend ${prefix}gender firstname`;
    await reply(message);
    return;
  }
  let text = await getGender(namePerson);
  await reply(text);
};
