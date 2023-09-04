import { WAMessage } from "@whiskeysockets/baileys";
import axios from "axios";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";

const getGender = async (name: string): Promise<string | undefined> => {
  try {
    interface Gender {
      count: number;
      name: string;
      gender: string;
      probability: number;
    }

    const url = `https://api.genderize.io/?name=${name}`;
    const { data } = await axios.get<Gender>(url);
    const genderText = `${data.name} is ${data.gender} with ${data.probability} probability`;

    return genderText;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return err.stack;
    }
  }

  return undefined;
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
