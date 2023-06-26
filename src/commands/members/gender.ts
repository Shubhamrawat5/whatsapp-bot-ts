import { WAMessage } from "@adiwajshing/baileys";
import axios from "axios";
import { MsgInfoObj } from "../../interface/msgInfoObj";
import { Bot } from "../../interface/Bot";
import { prefix } from "../../constants/constants";

const getGender = async (name: string) => {
  try {
    const url = `https://api.genderize.io/?name=${name}`;
    const { data } = await axios.get(url);
    const genderText = `${data.name} is ${data.gender} with ${data.probability} probability`;
    return genderText;
  } catch (err) {
    console.log(err);
    return (err as Error).stack;
  }
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;

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

const gender = () => {
  const cmd = ["gender"];

  return { cmd, handler };
};

export default gender;
