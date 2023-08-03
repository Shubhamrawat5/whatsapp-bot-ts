import { WAMessage } from "@whiskeysockets/baileys";
import axios from "axios";
import { MsgInfoObj } from "../../interfaces/msgInfoObj";
import { Bot } from "../../interfaces/Bot";
import { prefix } from "../../utils/constants";

const getHoro = async (name: string): Promise<string> => {
  try {
    // let url = `https://aztro.sameerkumar.website/?sign=${name}&day=today`;
    const url = `https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test`;

    // TODO: USE INTERFACE FOR ALL AXIOS REQUEST
    const { data } = await axios.post(url, null, {
      params: {
        sign: name,
        date: "today",
        token: "mmEUtLATc8w_UNnHuR2",
      },
    });
    const horoText = `*Horo:* ${name.toUpperCase()}
*Date:* ${data.current_date}
*Lucky Number:* ${data.lucky_number}
*Lucky Time:* ${data.lucky_time}
*Color:* ${data.color}
*Mood:* ${data.mood}`;
    // *Description:* ${data.description}`;

    // let horoText = `Current Date: ${data.current_date}
    // Compatibility: ${data.compatibility}
    // Lucky Number: ${data.lucky_number}
    // Lucky Time: ${data.lucky_time}
    // Color: ${data.color}
    // Date Range: ${data.date_range}
    // Mood: ${data.mood}
    // Description: ${data.description}`;

    return horoText;
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return err.toString();
    }

    return "❌ UNKNOWN ERROR !!";
  }
};

const handler = async (bot: Bot, msg: WAMessage, msgInfoObj: MsgInfoObj) => {
  const { reply, args } = msgInfoObj;

  if (args.length === 0) {
    const message = `❌ Name is not given! \nSend ${prefix}horo name`;
    await reply(message);
    return;
  }

  const name = args[0].toLowerCase();
  const horos = [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
  ];

  if (!horos.includes(name)) {
    const message = `❌ Wrong horo name given! \nSend ${prefix}horo name\n\nHoro List: ${JSON.stringify(
      horos
    )}`;
    await reply(message);
    return;
  }
  const text = await getHoro(name);
  await reply(text);
};

const horo = () => {
  const cmd = ["horo", "horoscope"];

  return { cmd, handler };
};

export default horo;
